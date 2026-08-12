// Trigger Railway deployment - community recipes
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

require("dotenv").config();

async function sendChefySms(toPhoneNumber, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhoneNumber) {
    console.log("Twilio SMS skipped: missing Twilio environment variables");
    return {
      success: false,
      skipped: true,
      reason: "Missing Twilio environment variables"
    };
  }

  if (!toPhoneNumber) {
    return {
      success: false,
      skipped: true,
      reason: "Receiver has no phone number"
    };
  }

  const cleanToNumber = String(toPhoneNumber).replace(/\s+/g, "");

  if (!cleanToNumber.startsWith("+")) {
    return {
      success: false,
      skipped: true,
      reason: "Phone number must use international format, example +959xxxxxxxx"
    };
  }

  try {
    const client = twilio(accountSid, authToken);

    const sms = await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: cleanToNumber
    });

    return {
      success: true,
      sid: sms.sid
    };
  } catch (error) {
    console.error("Twilio SMS failed:", error.message);

    return {
      success: false,
      skipped: false,
      reason: error.message
    };
  }
}

const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

app.get("/", (req, res) => {
  res.json({
    message: "Chefy backend is running"
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute("SELECT DATABASE() AS database_name");

    await connection.end();

    res.json({
      success: true,
      message: "Database connected successfully",
      database: rows[0].database_name
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Search users to add as favorite contacts
app.get("/api/users/search", async (req, res) => {
  try {
    const rawQuery = req.query.query || "";
    const currentUserId = Number(req.query.currentUserId || 0);
    const query = rawQuery.trim();

    if (!query) {
      return res.json({
        success: true,
        users: []
      });
    }

    const connection = await getConnection();

    let rows = [];

    // Exact Chefy ID search:
    // CHEFY-0004, CHEFY-004, CFY-004, 0004, or 4
    const chefyIdMatch = query.match(/^(?:CHEFY-|CFY-)?0*(\d+)$/i);

    if (chefyIdMatch) {
      const searchedUserId = Number(chefyIdMatch[1]);

      const [idRows] = await connection.execute(
        `
        SELECT 
          user_id,
          display_name,
          email,
          phone_number
        FROM users
        WHERE user_id = ?
          AND user_id != ?
        LIMIT 1
        `,
        [searchedUserId, currentUserId]
      );

      rows = idRows;
    } else {
      // Loose search only for name, email, or phone
      const searchText = `%${query}%`;

      const [searchRows] = await connection.execute(
        `
        SELECT 
          user_id,
          display_name,
          email,
          phone_number
        FROM users
        WHERE 
          (
            display_name LIKE ?
            OR email LIKE ?
            OR phone_number LIKE ?
          )
          AND user_id != ?
        ORDER BY display_name ASC
        LIMIT 20
        `,
        [searchText, searchText, searchText, currentUserId]
      );

      rows = searchRows;
    }

    await connection.end();

    res.json({
      success: true,
      users: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message
    });
  }
});

// Get favorite contacts for one user
app.get("/api/favorite-contacts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const connection = await getConnection();

    const [rows] = await connection.execute(
      `
      SELECT 
        u.user_id,
        u.display_name,
        u.email,
        u.phone_number,
        fc.created_at
      FROM favorite_contacts fc
      JOIN users u ON fc.contact_user_id = u.user_id
      WHERE fc.user_id = ?
      ORDER BY fc.created_at DESC
      `,
      [userId]
    );

    await connection.end();

    res.json({
      success: true,
      contacts: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load favorite contacts",
      error: error.message
    });
  }
});

// Add favorite contact
app.post("/api/favorite-contacts", async (req, res) => {
  try {
    const { userId, contactUserId } = req.body;

    if (!userId || !contactUserId) {
      return res.status(400).json({
        success: false,
        message: "userId and contactUserId are required"
      });
    }

    if (String(userId) === String(contactUserId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a favorite contact"
      });
    }

    const connection = await getConnection();

    const [contactRows] = await connection.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [contactUserId]
    );

    if (contactRows.length === 0) {
      await connection.end();

      return res.status(404).json({
        success: false,
        message: "Contact user not found"
      });
    }

    await connection.execute(
      `
      INSERT IGNORE INTO favorite_contacts (user_id, contact_user_id)
      VALUES (?, ?)
      `,
      [userId, contactUserId]
    );

    await connection.end();

    res.json({
      success: true,
      message: "Favorite contact added"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add favorite contact",
      error: error.message
    });
  }
});

// Remove favorite contact
app.delete("/api/favorite-contacts/:userId/:contactUserId", async (req, res) => {
  try {
    const { userId, contactUserId } = req.params;

    const connection = await getConnection();

    await connection.execute(
      `
      DELETE FROM favorite_contacts
      WHERE user_id = ? AND contact_user_id = ?
      `,
      [userId, contactUserId]
    );

    await connection.end();

    res.json({
      success: true,
      message: "Favorite contact removed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite contact",
      error: error.message
    });
  }
});

// Send a custom cooking update to all favourite contacts.
// This version sends both in-app notifications and real SMS through Twilio.
app.post("/api/favorite-contacts/notify", async (req, res) => {
  let connection;

  try {
    const { userId, message } = req.body;
    const cleanMessage = String(message || "").trim();

    if (!userId || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "userId and message are required"
      });
    }

    if (cleanMessage.length > 240) {
      return res.status(400).json({
        success: false,
        message: "Message must be 240 characters or less"
      });
    }

    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Login token is required"
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (String(decoded.id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only notify contacts from your own account"
      });
    }

    connection = await getConnection();

    const [senderRows] = await connection.execute(
      `
      SELECT user_id, display_name
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    if (senderRows.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const [favoriteRows] = await connection.execute(
      `
      SELECT
        u.user_id,
        u.display_name,
        u.phone_number
      FROM favorite_contacts fc
      JOIN users u
        ON fc.contact_user_id = u.user_id
      WHERE fc.user_id = ?
      ORDER BY fc.created_at DESC
      `,
      [userId]
    );

    if (favoriteRows.length === 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        message: "Please add at least one favourite contact first"
      });
    }

    const senderName = senderRows[0].display_name;
    const notificationMessage = `${senderName} says: ${cleanMessage}`;

    const smsResults = [];

    for (const contact of favoriteRows) {
      await connection.execute(
        `
        INSERT INTO notifications (
          sender_user_id,
          receiver_user_id,
          recipe_id,
          message
        )
        VALUES (?, ?, NULL, ?)
        `,
        [userId, contact.user_id, notificationMessage]
      );

      const smsResult = await sendChefySms(contact.phone_number, notificationMessage);

      smsResults.push({
        userId: contact.user_id,
        displayName: contact.display_name,
        phoneNumber: contact.phone_number || null,
        smsSuccess: smsResult.success,
        smsSkipped: smsResult.skipped || false,
        reason: smsResult.reason || null,
        sid: smsResult.sid || null
      });
    }

    await connection.end();

    const smsSentCount = smsResults.filter(item => item.smsSuccess).length;

    res.json({
      success: true,
      message:
        "Message sent as in-app notification to " +
        favoriteRows.length +
        " favourite contact" +
        (favoriteRows.length === 1 ? "" : "s") +
        ". SMS sent to " +
        smsSentCount +
        " contact" +
        (smsSentCount === 1 ? "" : "s") +
        ".",
      notificationsCreated: favoriteRows.length,
      smsSentCount: smsSentCount,
      smsResults: smsResults
    });
  } catch (error) {
    if (connection) {
      await connection.end();
    }

    res.status(500).json({
      success: false,
      message: "Failed to notify favourite contacts",
      error: error.message
    });
  }
});

// Sign up
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { displayName, email, phoneNumber, password } = req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Display name, email, and password are required"
      });
    }

    const connection = await getConnection();

    const [existingUsers] = await connection.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.end();

      return res.status(409).json({
        success: false,
        message: "This email is already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      `
      INSERT INTO users (
        display_name,
        email,
        phone_number,
        password_hash
      )
      VALUES (?, ?, ?, ?)
      `,
      [displayName, email, phoneNumber || null, passwordHash]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      {
        id: userId,
        userId: userId,
        email: email,
        role: "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await connection.end();

    res.json({
      success: true,
      message: "Sign up successful",
      token: token,
      user: {
        id: userId,
        displayName: displayName,
        email: email,
        phoneNumber: phoneNumber || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sign up failed",
      error: error.message
    });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const connection = await getConnection();

    const [users] = await connection.execute(
      `
      SELECT
        user_id,
        display_name,
        email,
        phone_number,
        password_hash,
        role,
        login_count,
        last_login_at
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (users.length === 0) {
      await connection.end();

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      await connection.end();

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    await connection.execute(
      `
      UPDATE users
      SET
        login_count = COALESCE(login_count, 0) + 1,
        last_login_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
      `,
      [user.user_id]
    );

    const [updatedRows] = await connection.execute(
      `
      SELECT login_count, last_login_at
      FROM users
      WHERE user_id = ?
      `,
      [user.user_id]
    );

    await connection.end();

    const updatedLoginData = updatedRows[0];

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role || "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.user_id,
        displayName: user.display_name,
        email: user.email,
        phoneNumber: user.phone_number,
        role: user.role || "user",
        loginCount: updatedLoginData.login_count,
        lastLoginAt: updatedLoginData.last_login_at
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});// Get all ingredients
app.get("/api/ingredients", async (req, res) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT ingredient_id, ingredient_name
      FROM ingredients
      ORDER BY ingredient_name ASC
    `);

    await connection.end();

    res.json({
      success: true,
      ingredients: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load ingredients",
      error: error.message
    });
  }
});

// Generate Daily Meals recipes by selected ingredients
// Daily Meals should not return Kid Foods, so this route filters age_group IS NULL.
app.post("/api/recipes/generate", async (req, res) => {
  try {
    const { selectedIngredients, userId } = req.body;

    if (!selectedIngredients || !Array.isArray(selectedIngredients) || selectedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one ingredient"
      });
    }

    const cleanIngredients = selectedIngredients.map(item =>
      String(item).trim().toLowerCase()
    );

    const connection = await getConnection();

    // Save ingredient search only when userId exists
    if (userId) {
      const [searchResult] = await connection.execute(
        "INSERT INTO ingredient_searches (user_id) VALUES (?)",
        [userId]
      );

      const searchId = searchResult.insertId;

      for (const ingredientName of cleanIngredients) {
        const [ingredientRows] = await connection.execute(
          "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?",
          [ingredientName]
        );

        if (ingredientRows.length > 0) {
          await connection.execute(
            `
            INSERT IGNORE INTO ingredient_search_items (search_id, ingredient_id)
            VALUES (?, ?)
            `,
            [searchId, ingredientRows[0].ingredient_id]
          );
        }
      }
    }

    const placeholders = cleanIngredients.map(() => "?").join(",");

    const [rows] = await connection.execute(
      `
      SELECT 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages,
        COUNT(i.ingredient_id) AS match_count,
        GROUP_CONCAT(i.ingredient_name ORDER BY i.ingredient_name SEPARATOR ', ') AS matched_ingredients
      FROM recipes r
      JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE i.ingredient_name IN (${placeholders})
        AND r.age_group IS NULL
      GROUP BY 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages
      ORDER BY match_count DESC, r.recipe_name ASC
      `,
      cleanIngredients
    );

    await connection.end();

    res.json({
      success: true,
      selectedIngredients: cleanIngredients,
      recipes: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate recipes",
      error: error.message
    });
  }
});

// Record finished cooking
// Record finished cooking and notify favourite contacts
app.post("/api/completions", async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
      return res.status(400).json({
        success: false,
        message: "userId and recipeId are required"
      });
    }

    const connection = await getConnection();

    const [userRows] = await connection.execute(
      `
      SELECT user_id, display_name
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    if (userRows.length === 0) {
      await connection.end();

      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const [recipeRows] = await connection.execute(
      `
      SELECT recipe_id, recipe_name
      FROM recipes
      WHERE recipe_id = ?
      `,
      [recipeId]
    );

    if (recipeRows.length === 0) {
      await connection.end();

      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    const senderName = userRows[0].display_name;
    const recipeName = recipeRows[0].recipe_name;

    await connection.execute(
      `
      INSERT INTO recipe_completions (user_id, recipe_id)
      VALUES (?, ?)
      `,
      [userId, recipeId]
    );

    const [favoriteRows] = await connection.execute(
      `
      SELECT contact_user_id
      FROM favorite_contacts
      WHERE user_id = ?
      `,
      [userId]
    );

    const message = `${senderName} has finished cooking ${recipeName} in Chefy.Tell them to cook for u now!!!`;

    for (const contact of favoriteRows) {
      await connection.execute(
        `
        INSERT INTO notifications (
          sender_user_id,
          receiver_user_id,
          recipe_id,
          message
        )
        VALUES (?, ?, ?, ?)
        `,
        [userId, contact.contact_user_id, recipeId, message]
      );
    }

    await connection.end();

    res.json({
      success: true,
      message: "Recipe completion recorded and notifications created",
      notificationsCreated: favoriteRows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to record recipe completion",
      error: error.message
    });
  }
});
// Get notifications for one user
app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const connection = await getConnection();

    const [rows] = await connection.execute(
      `
      SELECT 
        n.notification_id,
        n.sender_user_id,
        sender.display_name AS sender_name,
        n.receiver_user_id,
        n.recipe_id,
        r.recipe_name,
        n.message,
        n.is_read,
        n.created_at
      FROM notifications n
      JOIN users sender ON n.sender_user_id = sender.user_id
      LEFT JOIN recipes r ON n.recipe_id = r.recipe_id
      WHERE n.receiver_user_id = ?
      ORDER BY n.created_at DESC
      `,
      [userId]
    );

    const [countRows] = await connection.execute(
      `
      SELECT COUNT(*) AS unread_count
      FROM notifications
      WHERE receiver_user_id = ? AND is_read = FALSE
      `,
      [userId]
    );

    await connection.end();

    res.json({
      success: true,
      unreadCount: countRows[0].unread_count,
      notifications: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load notifications",
      error: error.message
    });
  }
});

// Mark one notification as read
app.patch("/api/notifications/:notificationId/read", async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    const connection = await getConnection();

    await connection.execute(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE notification_id = ?
      `,
      [notificationId]
    );

    await connection.end();

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message
    });
  }
});

// Mark all notifications as read for one user
app.patch("/api/notifications/:userId/read-all", async (req, res) => {
  try {
    const userId = req.params.userId;

    const connection = await getConnection();

    await connection.execute(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE receiver_user_id = ?
      `,
      [userId]
    );

    await connection.end();

    res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: error.message
    });
  }
});

// Get popular recipes
app.get("/api/popular-recipes", async (req, res) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        r.recipe_id,
        r.recipe_name,
        r.age_group,
        r.short_advantages,
        COUNT(DISTINCT rc.user_id) AS finished_users
      FROM recipe_completions rc
      JOIN recipes r ON rc.recipe_id = r.recipe_id
      GROUP BY 
        r.recipe_id,
        r.recipe_name,
        r.age_group,
        r.short_advantages
      HAVING COUNT(DISTINCT rc.user_id) >= 20
      ORDER BY finished_users DESC
    `);

    await connection.end();

    res.json({
      success: true,
      popularRecipes: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load popular recipes",
      error: error.message
    });
  }
});// Get all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages,
        GROUP_CONCAT(i.ingredient_name ORDER BY i.ingredient_name SEPARATOR ', ') AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      GROUP BY 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages
      ORDER BY r.recipe_name ASC
    `);

    await connection.end();

    res.json({
      success: true,
      recipes: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load recipes",
      error: error.message
    });
  }
});

// Get recipes by age group
app.get("/api/recipes/age/:ageGroup", async (req, res) => {
  try {
    const ageGroup = decodeURIComponent(req.params.ageGroup);
    const connection = await getConnection();

    const [rows] = await connection.execute(
      `
      SELECT 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages,
        GROUP_CONCAT(i.ingredient_name ORDER BY i.ingredient_name SEPARATOR ', ') AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE r.age_group = ?
      GROUP BY 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages
      ORDER BY r.recipe_name ASC
      `,
      [ageGroup]
    );

    await connection.end();

    res.json({
      success: true,
      ageGroup: ageGroup,
      recipes: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load recipes by age group",
      error: error.message
    });
  }
});

// Get daily meal recipes
app.get("/api/recipes-daily", async (req, res) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute(`
      SELECT 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages,
        GROUP_CONCAT(i.ingredient_name ORDER BY i.ingredient_name SEPARATOR ', ') AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE r.age_group IS NULL
      GROUP BY 
        r.recipe_id,
        r.recipe_name,
        r.category,
        r.age_group,
        r.short_advantages,
        r.advantages
      ORDER BY r.recipe_name ASC
    `);

    await connection.end();

    res.json({
      success: true,
      recipes: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load daily meal recipes",
      error: error.message
    });
  }
});

// Get one recipe by ID, including steps and ingredients
app.get("/api/recipes/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const connection = await getConnection();

    const [recipeRows] = await connection.execute(
      `
      SELECT 
        recipe_id,
        recipe_name,
        category,
        age_group,
        short_advantages,
        advantages
      FROM recipes
      WHERE recipe_id = ?
      `,
      [recipeId]
    );

    if (recipeRows.length === 0) {
      await connection.end();

      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    const [ingredientRows] = await connection.execute(
      `
      SELECT i.ingredient_name
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.ingredient_name ASC
      `,
      [recipeId]
    );

    const [stepRows] = await connection.execute(
      `
      SELECT step_number, instruction
      FROM recipe_steps
      WHERE recipe_id = ?
      ORDER BY step_number ASC
      `,
      [recipeId]
    );

    await connection.end();

    res.json({
      success: true,
      recipe: {
        ...recipeRows[0],
        ingredients: ingredientRows.map(row => row.ingredient_name),
        steps: stepRows
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load recipe",
      error: error.message
    });
  }
});

app.get("/api/insights", async (req, res) => {
  try {
    const connection = await getConnection();

    const [recipeRows] = await connection.execute(
      "SELECT COUNT(*) AS total_recipes FROM recipes"
    );

    const [userRows] = await connection.execute(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const [popularRows] = await connection.execute(`
      SELECT 
        r.recipe_id,
        r.recipe_name,
        r.age_group,
        r.short_advantages,
        COUNT(DISTINCT rc.user_id) AS finished_users
      FROM recipe_completions rc
      JOIN recipes r ON rc.recipe_id = r.recipe_id
      GROUP BY r.recipe_id, r.recipe_name, r.age_group, r.short_advantages
      HAVING COUNT(DISTINCT rc.user_id) >= 20
      ORDER BY finished_users DESC
    `);

    await connection.end();

    res.json({
      success: true,
      totalRecipes: recipeRows[0].total_recipes,
      totalUsers: userRows[0].total_users,
      popularRecipes: popularRows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load insights",
      error: error.message
    });
  }
});
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Login token is required"
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const connection = await getConnection();

    const [rows] = await connection.execute(
      `
      SELECT user_id, role
      FROM users
      WHERE user_id = ?
      `,
      [decoded.id]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (rows[0].role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only"
      });
    }

    req.user = {
      id: rows[0].user_id,
      role: rows[0].role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired login token"
    });
  }
}
app.get("/api/admin/dashboard", requireAdmin, async (req, res) => {
  try {
    const connection = await getConnection();

    const [users] = await connection.execute(
      `
      SELECT
        u.user_id,
        u.display_name,
        u.email,
        u.phone_number,
        u.role,
        COALESCE(u.login_count, 0) AS login_count,
        u.last_login_at,
        COALESCE(f.favorite_ingredients, 'No favourite yet') AS favorite_ingredients
      FROM users u
      LEFT JOIN (
        SELECT
          ingredient_counts.user_id,
          GROUP_CONCAT(
            CONCAT(
              ingredient_counts.ingredient_name,
              ' (',
              ingredient_counts.selection_count,
              ')'
            )
            ORDER BY ingredient_counts.selection_count DESC, ingredient_counts.ingredient_name ASC
            SEPARATOR ', '
          ) AS favorite_ingredients
        FROM (
          SELECT
            s.user_id,
            i.ingredient_name,
            COUNT(*) AS selection_count
          FROM ingredient_searches s
          JOIN ingredient_search_items si
            ON s.search_id = si.search_id
          JOIN ingredients i
            ON si.ingredient_id = i.ingredient_id
          GROUP BY
            s.user_id,
            i.ingredient_id,
            i.ingredient_name
          HAVING COUNT(*) >= 3
        ) ingredient_counts
        GROUP BY ingredient_counts.user_id
      ) f
        ON u.user_id = f.user_id
      ORDER BY u.user_id ASC
      `
    );

    await connection.end();

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message
    });
  }
});

// Add a new recipe from the protected admin page
app.post("/api/admin/recipes", requireAdmin, async (req, res) => {
  let connection;

  try {
    const {
      recipeId,
      recipeName,
      category,
      ageGroup,
      ingredients,
      shortAdvantages,
      advantages,
      steps
    } = req.body;

    if (!recipeId || !recipeName || !category) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID, recipe name, and category are required"
      });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one ingredient"
      });
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one cooking step"
      });
    }

    const cleanRecipeId = String(recipeId).trim().toLowerCase();
    const cleanRecipeName = String(recipeName).trim();
    const cleanCategory = String(category).trim();
    const cleanAgeGroup = cleanCategory === "Daily Meals" ? null : (ageGroup || null);
    const cleanIngredients = ingredients
      .map(item => String(item).trim().toLowerCase())
      .filter(Boolean);
    const cleanSteps = steps
      .map(item => String(item).trim())
      .filter(Boolean);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanRecipeId)) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must use small letters, numbers, and hyphens only"
      });
    }

    if (cleanCategory === "Kid Foods" && !cleanAgeGroup) {
      return res.status(400).json({
        success: false,
        message: "Please choose an age group for Kid Foods"
      });
    }

    connection = await getConnection();
    await connection.beginTransaction();

    const [existingRows] = await connection.execute(
      "SELECT recipe_id FROM recipes WHERE recipe_id = ?",
      [cleanRecipeId]
    );

    if (existingRows.length > 0) {
      await connection.rollback();
      await connection.end();
      return res.status(409).json({
        success: false,
        message: "A recipe with this ID already exists"
      });
    }

    await connection.execute(
      `
      INSERT INTO recipes (
        recipe_id,
        recipe_name,
        category,
        age_group,
        short_advantages,
        advantages
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        cleanRecipeId,
        cleanRecipeName,
        cleanCategory,
        cleanAgeGroup,
        shortAdvantages || "",
        advantages || ""
      ]
    );

    for (const ingredientName of cleanIngredients) {
      await connection.execute(
        `
        INSERT IGNORE INTO ingredients (ingredient_name)
        VALUES (?)
        `,
        [ingredientName]
      );

      const [ingredientRows] = await connection.execute(
        `
        SELECT ingredient_id
        FROM ingredients
        WHERE ingredient_name = ?
        `,
        [ingredientName]
      );

      if (ingredientRows.length > 0) {
        await connection.execute(
          `
          INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id)
          VALUES (?, ?)
          `,
          [cleanRecipeId, ingredientRows[0].ingredient_id]
        );
      }
    }

    for (let i = 0; i < cleanSteps.length; i++) {
      await connection.execute(
        `
        INSERT INTO recipe_steps (recipe_id, step_number, instruction)
        VALUES (?, ?, ?)
        `,
        [cleanRecipeId, i + 1, cleanSteps[i]]
      );
    }

    await connection.commit();
    await connection.end();

    res.json({
      success: true,
      message: "Recipe added successfully",
      recipeId: cleanRecipeId
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
        await connection.end();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to add recipe",
      error: error.message
    });
  }
});



// =========================================================
// Community Recipe Submissions
// Users can submit recipes for admin moderation. Approved
// submissions are copied into the normal Chefy recipe dataset.
// =========================================================
async function ensureCommunityRecipeTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS user_recipe_submissions (
      submission_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      recipe_name VARCHAR(160) NOT NULL,
      description TEXT NULL,
      ingredients_json LONGTEXT NOT NULL,
      steps_json LONGTEXT NOT NULL,
      prep_time_minutes INT NULL,
      cook_time_minutes INT NULL,
      servings INT NULL,
      image_url TEXT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      admin_note TEXT NULL,
      approved_recipe_id VARCHAR(160) NULL,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP NULL,
      reviewed_by INT NULL,
      INDEX idx_user_recipe_status (status),
      INDEX idx_user_recipe_user (user_id)
    )
  `);
}

function readBearerUser(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("LOGIN_REQUIRED");
  }
  const token = authHeader.replace("Bearer ", "");
  return jwt.verify(token, process.env.JWT_SECRET);
}

function safeJsonArray(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function makeCommunityRecipeId(recipeName, submissionId) {
  const slug = String(recipeName || "community-recipe")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "community-recipe";
  return `${slug}-community-${submissionId}`;
}

// Submit a recipe as a normal signed-in user.
app.post("/api/community-recipes", async (req, res) => {
  let connection;
  try {
    const decoded = readBearerUser(req);
    const {
      recipeName,
      description,
      ingredientIds,
      steps,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      imageUrl
    } = req.body || {};

    const cleanName = String(recipeName || "").trim();
    const cleanIngredientIds = Array.isArray(ingredientIds)
      ? [...new Set(ingredientIds.map(Number).filter(Number.isFinite))]
      : [];
    const cleanSteps = Array.isArray(steps)
      ? steps.map(item => String(item || "").trim()).filter(Boolean)
      : [];

    if (!cleanName) {
      return res.status(400).json({ success: false, message: "Recipe name is required" });
    }
    if (cleanIngredientIds.length === 0) {
      return res.status(400).json({ success: false, message: "Please choose at least one ingredient" });
    }
    if (cleanSteps.length === 0) {
      return res.status(400).json({ success: false, message: "Please add at least one cooking step" });
    }

    connection = await getConnection();
    await ensureCommunityRecipeTable(connection);

    const placeholders = cleanIngredientIds.map(() => "?").join(",");
    const [ingredientRows] = await connection.execute(
      `SELECT ingredient_id, ingredient_name FROM ingredients WHERE ingredient_id IN (${placeholders}) ORDER BY ingredient_name ASC`,
      cleanIngredientIds
    );

    if (ingredientRows.length !== cleanIngredientIds.length) {
      await connection.end();
      return res.status(400).json({ success: false, message: "One or more selected ingredients are invalid" });
    }

    const ingredients = ingredientRows.map(row => ({
      ingredient_id: row.ingredient_id,
      ingredient_name: row.ingredient_name
    }));

    const [result] = await connection.execute(
      `INSERT INTO user_recipe_submissions
        (user_id, recipe_name, description, ingredients_json, steps_json, prep_time_minutes, cook_time_minutes, servings, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        decoded.id,
        cleanName,
        String(description || "").trim(),
        JSON.stringify(ingredients),
        JSON.stringify(cleanSteps),
        Number(prepTimeMinutes) || null,
        Number(cookTimeMinutes) || null,
        Number(servings) || null,
        String(imageUrl || "").trim() || null
      ]
    );

    await connection.end();
    res.status(201).json({
      success: true,
      message: "Recipe submitted successfully and is waiting for admin review.",
      submissionId: result.insertId,
      status: "pending"
    });
  } catch (error) {
    if (connection) { try { await connection.end(); } catch (_) {} }
    if (error.message === "LOGIN_REQUIRED") {
      return res.status(401).json({ success: false, message: "Please login before submitting a recipe" });
    }
    res.status(500).json({ success: false, message: "Failed to submit recipe", error: error.message });
  }
});

// Let a user see their own submissions and statuses.
app.get("/api/community-recipes/mine", async (req, res) => {
  let connection;
  try {
    const decoded = readBearerUser(req);
    connection = await getConnection();
    await ensureCommunityRecipeTable(connection);
    const [rows] = await connection.execute(
      `SELECT submission_id, recipe_name, description, ingredients_json, steps_json,
              prep_time_minutes, cook_time_minutes, servings, image_url, status,
              admin_note, approved_recipe_id, submitted_at, reviewed_at
       FROM user_recipe_submissions
       WHERE user_id = ?
       ORDER BY submitted_at DESC`,
      [decoded.id]
    );
    await connection.end();
    res.json({
      success: true,
      submissions: rows.map(row => ({
        ...row,
        ingredients: safeJsonArray(row.ingredients_json),
        steps: safeJsonArray(row.steps_json)
      }))
    });
  } catch (error) {
    if (connection) { try { await connection.end(); } catch (_) {} }
    if (error.message === "LOGIN_REQUIRED") {
      return res.status(401).json({ success: false, message: "Please login first" });
    }
    res.status(500).json({ success: false, message: "Failed to load your recipe submissions", error: error.message });
  }
});

// Approved community recipes are exposed to the For You recommendation pool.
app.get("/api/community-recipes/approved", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await ensureCommunityRecipeTable(connection);
    const [rows] = await connection.execute(
      `SELECT urs.submission_id, urs.recipe_name, urs.description, urs.ingredients_json,
              urs.steps_json, urs.prep_time_minutes, urs.cook_time_minutes, urs.servings,
              urs.image_url, urs.approved_recipe_id, urs.reviewed_at,
              u.display_name AS submitted_by
       FROM user_recipe_submissions urs
       JOIN users u ON u.user_id = urs.user_id
       WHERE urs.status = 'approved' AND urs.approved_recipe_id IS NOT NULL
       ORDER BY urs.reviewed_at DESC`
    );
    await connection.end();
    res.json({
      success: true,
      recipes: rows.map(row => ({
        id: row.approved_recipe_id,
        name: row.recipe_name,
        category: "Daily Meals",
        ageGroup: null,
        image: row.image_url || "",
        ingredients: safeJsonArray(row.ingredients_json).map(item => item.ingredient_name || item.name || String(item)),
        steps: safeJsonArray(row.steps_json),
        shortAdvantages: row.description || "Community recipe submitted by a Chefy user.",
        advantages: row.description || "Community recipe submitted by a Chefy user.",
        submittedBy: row.submitted_by,
        communityRecipe: true
      }))
    });
  } catch (error) {
    if (connection) { try { await connection.end(); } catch (_) {} }
    res.status(500).json({ success: false, message: "Failed to load approved community recipes", error: error.message });
  }
});

// Admin: list all user submissions, newest first.
app.get("/api/admin/community-recipes", requireAdmin, async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await ensureCommunityRecipeTable(connection);
    const [rows] = await connection.execute(
      `SELECT urs.*, u.display_name, u.email
       FROM user_recipe_submissions urs
       JOIN users u ON u.user_id = urs.user_id
       ORDER BY FIELD(urs.status, 'pending', 'approved', 'rejected'), urs.submitted_at DESC`
    );
    await connection.end();
    res.json({
      success: true,
      submissions: rows.map(row => ({
        ...row,
        ingredients: safeJsonArray(row.ingredients_json),
        steps: safeJsonArray(row.steps_json)
      }))
    });
  } catch (error) {
    if (connection) { try { await connection.end(); } catch (_) {} }
    res.status(500).json({ success: false, message: "Failed to load recipe submissions", error: error.message });
  }
});

// Admin: approve a pending submission and publish it as a normal recipe.
app.patch("/api/admin/community-recipes/:submissionId/approve", requireAdmin, async (req, res) => {
  let connection;
  try {
    const submissionId = Number(req.params.submissionId);
    if (!Number.isFinite(submissionId)) {
      return res.status(400).json({ success: false, message: "Invalid submission ID" });
    }

    connection = await getConnection();
    await ensureCommunityRecipeTable(connection);
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT * FROM user_recipe_submissions WHERE submission_id = ? FOR UPDATE`,
      [submissionId]
    );
    if (rows.length === 0) {
      await connection.rollback(); await connection.end();
      return res.status(404).json({ success: false, message: "Recipe submission not found" });
    }
    const submission = rows[0];
    if (submission.status !== "pending") {
      await connection.rollback(); await connection.end();
      return res.status(409).json({ success: false, message: `This recipe is already ${submission.status}` });
    }

    const ingredients = safeJsonArray(submission.ingredients_json);
    const steps = safeJsonArray(submission.steps_json);
    const recipeId = makeCommunityRecipeId(submission.recipe_name, submissionId);

    await connection.execute(
      `INSERT INTO recipes (recipe_id, recipe_name, category, age_group, short_advantages, advantages)
       VALUES (?, ?, 'Daily Meals', NULL, ?, ?)`,
      [
        recipeId,
        submission.recipe_name,
        submission.description || "Community recipe submitted by a Chefy user.",
        submission.description || "Community recipe submitted by a Chefy user."
      ]
    );

    for (const item of ingredients) {
      const ingredientId = Number(item.ingredient_id);
      if (Number.isFinite(ingredientId)) {
        await connection.execute(
          `INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (?, ?)`,
          [recipeId, ingredientId]
        );
      }
    }

    for (let index = 0; index < steps.length; index += 1) {
      await connection.execute(
        `INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)`,
        [recipeId, index + 1, String(steps[index])]
      );
    }

    await connection.execute(
      `UPDATE user_recipe_submissions
       SET status = 'approved', approved_recipe_id = ?, reviewed_at = NOW(), reviewed_by = ?, admin_note = ?
       WHERE submission_id = ?`,
      [recipeId, req.user.id, String((req.body || {}).adminNote || "").trim() || null, submissionId]
    );

    await connection.execute(
      `INSERT INTO notifications (sender_user_id, receiver_user_id, recipe_id, message)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, submission.user_id, recipeId, `Your recipe “${submission.recipe_name}” has been approved and is now available on Chefy!`]
    );

    await connection.commit();
    await connection.end();
    res.json({ success: true, message: "Recipe approved and published successfully.", recipeId });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); await connection.end(); } catch (_) {}
    }
    res.status(500).json({ success: false, message: "Failed to approve recipe", error: error.message });
  }
});

// Admin: reject a pending submission with an optional note.
app.patch("/api/admin/community-recipes/:submissionId/reject", requireAdmin, async (req, res) => {
  let connection;
  try {
    const submissionId = Number(req.params.submissionId);
    if (!Number.isFinite(submissionId)) {
      return res.status(400).json({ success: false, message: "Invalid submission ID" });
    }
    connection = await getConnection();
    await ensureCommunityRecipeTable(connection);
    const [rows] = await connection.execute(
      `SELECT user_id, recipe_name, status FROM user_recipe_submissions WHERE submission_id = ?`,
      [submissionId]
    );
    if (rows.length === 0) { await connection.end(); return res.status(404).json({ success: false, message: "Recipe submission not found" }); }
    if (rows[0].status !== "pending") { await connection.end(); return res.status(409).json({ success: false, message: `This recipe is already ${rows[0].status}` }); }

    const note = String((req.body || {}).adminNote || "").trim();
    await connection.execute(
      `UPDATE user_recipe_submissions
       SET status = 'rejected', reviewed_at = NOW(), reviewed_by = ?, admin_note = ?
       WHERE submission_id = ?`,
      [req.user.id, note || null, submissionId]
    );
    await connection.execute(
      `INSERT INTO notifications (sender_user_id, receiver_user_id, recipe_id, message)
       VALUES (?, ?, NULL, ?)`,
      [req.user.id, rows[0].user_id, `Your recipe “${rows[0].recipe_name}” was reviewed but was not approved.${note ? " Note: " + note : ""}`]
    );
    await connection.end();
    res.json({ success: true, message: "Recipe submission rejected." });
  } catch (error) {
    if (connection) { try { await connection.end(); } catch (_) {} }
    res.status(500).json({ success: false, message: "Failed to reject recipe", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Chefy backend running on port ${PORT}`);
});
