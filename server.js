// =========================================================
// CHEFY BACKEND
// MongoDB / NoSQL Version
// =========================================================

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const mongoose = require("mongoose");

require("dotenv").config();

const Recipe = require("./models/Recipe");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));


// =========================================================
// MONGODB COUNTER
// Used to keep simple numeric IDs such as userId
// =========================================================

const counterSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },

    seq: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false
  }
);

const Counter =
  mongoose.models.Counter ||
  mongoose.model("Counter", counterSchema);


async function nextSequence(key) {

  const row = await Counter.findOneAndUpdate(
    { key: key },

    {
      $inc: {
        seq: 1
      }
    },

    {
      upsert: true,
      returnDocument: "after"
    }
  );

  return row.seq;
}


// =========================================================
// USER MODEL
// =========================================================

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },

    displayName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    phoneNumber: {
      type: String,
      default: null
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    loginCount: {
      type: Number,
      default: 0
    },

    lastLoginAt: {
      type: Date,
      default: null
    }
  },

  {
    timestamps: true
  }
);


const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);


// =========================================================
// FAVORITE CONTACT MODEL
// =========================================================

const favoriteContactSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true
    },

    contactUserId: {
      type: Number,
      required: true,
      index: true
    }
  },

  {
    timestamps: true
  }
);


favoriteContactSchema.index(
  {
    userId: 1,
    contactUserId: 1
  },

  {
    unique: true
  }
);


const FavoriteContact =
  mongoose.models.FavoriteContact ||
  mongoose.model(
    "FavoriteContact",
    favoriteContactSchema
  );


// =========================================================
// INGREDIENT MODEL
// =========================================================

const ingredientSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },

    ingredientName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    }
  },

  {
    timestamps: true
  }
);


const Ingredient =
  mongoose.models.Ingredient ||
  mongoose.model(
    "Ingredient",
    ingredientSchema
  );


// =========================================================
// INGREDIENT SEARCH HISTORY
// Used for Chefy recommendation/data analysis
// =========================================================

const ingredientSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true
    },

    ingredients: {
      type: [String],
      default: []
    }
  },

  {
    timestamps: true
  }
);


const IngredientSearch =
  mongoose.models.IngredientSearch ||
  mongoose.model(
    "IngredientSearch",
    ingredientSearchSchema
  );
  // =========================================================
// RECIPE COMPLETION MODEL
// =========================================================

const recipeCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true
    },

    recipeId: {
      type: String,
      required: true,
      index: true
    }
  },

  {
    timestamps: true
  }
);


const RecipeCompletion =
  mongoose.models.RecipeCompletion ||
  mongoose.model(
    "RecipeCompletion",
    recipeCompletionSchema
  );


// =========================================================
// NOTIFICATION MODEL
// =========================================================

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },

    senderUserId: {
      type: Number,
      required: true,
      index: true
    },

    receiverUserId: {
      type: Number,
      required: true,
      index: true
    },

    recipeId: {
      type: String,
      default: null
    },

    message: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
);


const Notification =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );


// =========================================================
// COMMUNITY RECIPE SUBMISSION MODEL
// =========================================================

const communityRecipeSubmissionSchema =
  new mongoose.Schema(
    {
      submissionId: {
        type: Number,
        required: true,
        unique: true,
        index: true
      },

      userId: {
        type: Number,
        required: true,
        index: true
      },

      recipeName: {
        type: String,
        required: true,
        trim: true
      },

      description: {
        type: String,
        default: ""
      },

      ingredients: {
        type: [
          {
            ingredient_id: Number,
            ingredient_name: String
          }
        ],
        default: []
      },

      steps: {
        type: [String],
        default: []
      },

      prepTimeMinutes: {
        type: Number,
        default: null
      },

      cookTimeMinutes: {
        type: Number,
        default: null
      },

      servings: {
        type: Number,
        default: null
      },

      imageUrl: {
        type: String,
        default: null
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected"
        ],
        default: "pending",
        index: true
      },

      adminNote: {
        type: String,
        default: null
      },

      approvedRecipeId: {
        type: String,
        default: null
      },

      reviewedAt: {
        type: Date,
        default: null
      },

      reviewedBy: {
        type: Number,
        default: null
      }
    },

    {
      timestamps: true
    }
  );


const CommunityRecipeSubmission =
  mongoose.models.CommunityRecipeSubmission ||
  mongoose.model(
    "CommunityRecipeSubmission",
    communityRecipeSubmissionSchema
  );


// =========================================================
// HELPER FUNCTIONS
// =========================================================

function normalizeIngredient(value) {
  let text = String(value || "")
    .toLowerCase()
    .trim();

  // Remove text in brackets, for example "(optional)"
  text = text.replace(/\([^)]*\)/g, " ");

  // Remove common ending notes
  text = text.replace(/,\s*(or\s+)?to\s+taste.*$/g, "");
  text = text.replace(/,\s*as\s+needed.*$/g, "");

  // Remove leading quantity:
  // 2, 2.5, 1/2, 1 1/2, ½ etc.
  text = text.replace(
    /^\s*(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?|[¼½¾⅓⅔⅛⅜⅝⅞])\s*/i,
    ""
  );

  // Remove common measurement units
  text = text.replace(
    /^\s*(?:tablespoons?|tablespoon|tbsp|tbsps|teaspoons?|teaspoon|tsp|tsps|cups?|cup|grams?|gram|g|kilograms?|kilogram|kg|milliliters?|millilitres?|ml|liters?|litres?|liter|litre|l|ounces?|ounce|oz|pounds?|pound|lbs?|cloves?|clove|pieces?|piece|slices?|slice|cans?|can|bunches?|bunch|sprigs?|sprig|stalks?|stalk|heads?|head|handfuls?|handful)\b\.?\s*/i,
    ""
  );

  // Remove preparation descriptions
  text = text.replace(
    /\b(?:finely|roughly|freshly|fresh|chopped|minced|shredded|diced|sliced|crushed|grated|peeled|seeded|softened|melted|divided|optional)\b/gi,
    " "
  );

  // Clean extra punctuation and spaces
  text = text
    .replace(/\s+/g, " ")
    .replace(/^[,\s-]+|[,\s-]+$/g, "")
    .trim();

  return text;
}


function readBearerUser(req) {

  const authHeader =
    req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {

    throw new Error("LOGIN_REQUIRED");
  }

  const token =
    authHeader.replace("Bearer ", "");

  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
}


async function createNotification({
  senderUserId,
  receiverUserId,
  recipeId = null,
  message
}) {

  const notificationId =
    await nextSequence("notificationId");

  return Notification.create({
    notificationId,
    senderUserId,
    receiverUserId,
    recipeId,
    message,
    isRead: false
  });
}


function makeCommunityRecipeId(
  recipeName,
  submissionId
) {

  const slug =
    String(
      recipeName ||
      "community-recipe"
    )
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      ) ||
    "community-recipe";

  return (
    slug +
    "-community-" +
    submissionId
  );
}


// =========================================================
// RECIPE RESPONSE FORMATTERS
// Keep old frontend field names compatible
// =========================================================

function formatRecipeListItem(
  recipe,
  extra = {}
) {

  return {
    recipe_id: recipe.recipeId,
    recipe_name: recipe.name,
    category: recipe.category,
    age_group:
      recipe.ageGroup ?? null,

    short_advantages:
      recipe.shortAdvantages || "",

    advantages:
      recipe.advantages || "",

    ingredients:
      Array.isArray(
        recipe.ingredients
      )
        ? recipe.ingredients.join(", ")
        : "",

    ...extra
  };
}


function formatRecipeDetail(recipe) {

  return {
    recipe_id: recipe.recipeId,
    recipe_name: recipe.name,
    category: recipe.category,
    age_group:
      recipe.ageGroup ?? null,

    short_advantages:
      recipe.shortAdvantages || "",

    advantages:
      recipe.advantages || "",

    image:
      recipe.image || "",

    ingredients:
      Array.isArray(
        recipe.ingredients
      )
        ? recipe.ingredients
        : [],

    steps:
      (
        Array.isArray(
          recipe.steps
        )
          ? recipe.steps
          : []
      ).map(
        (instruction, index) => ({
          step_number: index + 1,
          instruction: instruction
        })
      )
  };
}
// =========================================================
// SYNC INGREDIENT INDEX FROM RECIPE DOCUMENTS
// =========================================================

async function syncIngredientsFromRecipes() {

  // Get every ingredient used by the recipe documents
  const names = await Recipe.distinct("ingredients");

  const cleanNames = [
    ...new Set(
      names
        .map(normalizeIngredient)
        .filter(Boolean)
    )
  ].sort();


  // Get ingredients already stored
  const existingIngredients =
    await Ingredient.find({}).lean();


  // Find the highest ingredient ID already in MongoDB
  let highestIngredientId = 0;

  for (const ingredient of existingIngredients) {
    const id = Number(ingredient.ingredientId);

    if (
      Number.isFinite(id) &&
      id > highestIngredientId
    ) {
      highestIngredientId = id;
    }
  }


  // Synchronize MongoDB counter with existing IDs
  await Counter.findOneAndUpdate(
    {
      key: "ingredientId"
    },

    {
      $max: {
        seq: highestIngredientId
      }
    },

    {
      upsert: true,
      returnDocument: "after"
    }
  );


  const existingNames =
    new Set(
      existingIngredients.map(
        ingredient =>
          normalizeIngredient(
            ingredient.ingredientName
          )
      )
    );


  let added = 0;


  // Add ingredients that do not exist yet
  for (const ingredientName of cleanNames) {

    if (
      existingNames.has(
        ingredientName
      )
    ) {
      continue;
    }


    const ingredientId =
      await nextSequence(
        "ingredientId"
      );


    await Ingredient.create({
      ingredientId:
        ingredientId,

      ingredientName:
        ingredientName
    });


    existingNames.add(
      ingredientName
    );

    added++;
  }


  console.log(
    `Ingredient index ready: ${cleanNames.length} ingredients (${added} added)`
  );
}
       

// =========================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =========================================================

async function requireAdmin(
  req,
  res,
  next
) {
  try {
    const decoded =
      readBearerUser(req);

    const user =
      await User.findOne({
        userId: Number(decoded.id)
      }).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only"
      });
    }

    req.user = {
      id: user.userId,
      role: user.role
    };

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.message === "LOGIN_REQUIRED"
          ? "Login token is required"
          : "Invalid or expired login token"
    });
  }
}


// =========================================================
// TWILIO SMS
// =========================================================

async function sendChefySms(
  toPhoneNumber,
  message
) {
  const accountSid =
    process.env.TWILIO_ACCOUNT_SID;

  const authToken =
    process.env.TWILIO_AUTH_TOKEN;

  const fromPhoneNumber =
    process.env.TWILIO_PHONE_NUMBER;


  if (
    !accountSid ||
    !authToken ||
    !fromPhoneNumber
  ) {
    console.log(
      "Twilio SMS skipped: missing Twilio environment variables"
    );

    return {
      success: false,
      skipped: true,
      reason:
        "Missing Twilio environment variables"
    };
  }


  if (!toPhoneNumber) {
    return {
      success: false,
      skipped: true,
      reason:
        "Receiver has no phone number"
    };
  }


  const cleanToNumber =
    String(toPhoneNumber)
      .replace(/\s+/g, "");


  if (
    !cleanToNumber.startsWith("+")
  ) {
    return {
      success: false,
      skipped: true,
      reason:
        "Phone number must use international format, example +959xxxxxxxx"
    };
  }


  try {
    const client =
      twilio(
        accountSid,
        authToken
      );

    const sms =
      await client.messages.create({
        body: message,
        from: fromPhoneNumber,
        to: cleanToNumber
      });

    return {
      success: true,
      sid: sms.sid
    };

  } catch (error) {

    console.error(
      "Twilio SMS failed:",
      error.message
    );

    return {
      success: false,
      skipped: false,
      reason: error.message
    };
  }
}


// =========================================================
// BASIC HEALTH CHECK
// =========================================================

app.get(
  "/",
  (req, res) => {
    res.json({
      message:
        "Chefy backend is running",
      database:
        "MongoDB Atlas"
    });
  }
);


// =========================================================
// TEST MONGODB CONNECTION
// =========================================================

app.get(
  "/api/test-db",
  async (req, res) => {
    try {
      await mongoose
        .connection
        .db
        .admin()
        .ping();

      res.json({
        success: true,
        message:
          "MongoDB connected successfully",
        database:
          mongoose.connection.name
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error:
          error.message
      });
    }
  }
);
// =========================================================
// AUTHENTICATION — SIGN UP
// =========================================================

app.post(
  "/api/auth/signup",
  async (req, res) => {
    try {
      const {
        displayName,
        email,
        phoneNumber,
        password
      } = req.body;


      if (
        !displayName ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Display name, email, and password are required"
        });
      }


      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();


      const existingUser =
        await User.findOne({
          email: cleanEmail
        }).lean();


      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already registered"
        });
      }


      const passwordHash =
        await bcrypt.hash(
          password,
          10
        );


      const userId =
        await nextSequence(
          "userId"
        );


      const adminEmail =
        String(
          process.env.ADMIN_EMAIL || ""
        )
          .trim()
          .toLowerCase();


      const role =
        adminEmail &&
        adminEmail === cleanEmail
          ? "admin"
          : "user";


      const user =
        await User.create({
          userId: userId,
          displayName:
            String(displayName).trim(),
          email: cleanEmail,
          phoneNumber:
            phoneNumber || null,
          passwordHash: passwordHash,
          role: role
        });


      const token =
        jwt.sign(
          {
            id: user.userId,
            userId: user.userId,
            email: user.email,
            role: user.role
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d"
          }
        );


      res.json({
        success: true,
        message:
          "Sign up successful",

        token: token,

        user: {
          id: user.userId,
          displayName:
            user.displayName,
          email:
            user.email,
          phoneNumber:
            user.phoneNumber,
          role:
            user.role
        }
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Sign up failed",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// AUTHENTICATION — LOGIN
// =========================================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;


      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required"
        });
      }


      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();


      const user =
        await User.findOne({
          email: cleanEmail
        });


      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password"
        });
      }


      const passwordMatches =
        await bcrypt.compare(
          password,
          user.passwordHash
        );


      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password"
        });
      }


      user.loginCount =
        (user.loginCount || 0) + 1;

      user.lastLoginAt =
        new Date();


      await user.save();


      const token =
        jwt.sign(
          {
            id: user.userId,
            userId: user.userId,
            email: user.email,
            role:
              user.role || "user"
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d"
          }
        );


      res.json({
        success: true,
        message:
          "Login successful",

        token: token,

        user: {
          id:
            user.userId,

          displayName:
            user.displayName,

          email:
            user.email,

          phoneNumber:
            user.phoneNumber,

          role:
            user.role || "user",

          loginCount:
            user.loginCount,

          lastLoginAt:
            user.lastLoginAt
        }
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Login failed",
        error:
          error.message
      });
    }
  }
);
// =========================================================
// USER SEARCH
// Search users by Chefy ID, name, email, or phone
// =========================================================

app.get(
  "/api/users/search",
  async (req, res) => {
    try {
      const rawQuery =
        req.query.query || "";

      const currentUserId =
        Number(
          req.query.currentUserId || 0
        );

      const query =
        String(rawQuery).trim();


      if (!query) {
        return res.json({
          success: true,
          users: []
        });
      }


      let users = [];


      // -----------------------------------------
      // Search by Chefy numeric ID
      // Examples:
      // 12
      // CHEFY-12
      // CFY-12
      // -----------------------------------------

      const chefyIdMatch =
        query.match(
          /^(?:CHEFY-|CFY-)?0*(\d+)$/i
        );


      if (chefyIdMatch) {

        const searchedUserId =
          Number(
            chefyIdMatch[1]
          );


        users =
          await User.find({
            userId: {
              $eq: searchedUserId,
              $ne: currentUserId
            }
          })
            .limit(1)
            .lean();

      } else {

        // Escape special regex characters
        const safeQuery =
          query.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );


        const regex =
          new RegExp(
            safeQuery,
            "i"
          );


        users =
          await User.find({
            userId: {
              $ne: currentUserId
            },

            $or: [
              {
                displayName: regex
              },

              {
                email: regex
              },

              {
                phoneNumber: regex
              }
            ]
          })
            .sort({
              displayName: 1
            })
            .limit(20)
            .lean();
      }


      res.json({
        success: true,

        users:
          users.map(
            user => ({
              user_id:
                user.userId,

              display_name:
                user.displayName,

              email:
                user.email,

              phone_number:
                user.phoneNumber
            })
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to search users",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// GET FAVORITE CONTACTS
// =========================================================

app.get(
  "/api/favorite-contacts/:userId",
  async (req, res) => {
    try {

      const userId =
        Number(
          req.params.userId
        );


      const favoriteRows =
        await FavoriteContact
          .find({
            userId: userId
          })
          .sort({
            createdAt: -1
          })
          .lean();


      const contactIds =
        favoriteRows.map(
          row =>
            row.contactUserId
        );


      const users =
        await User.find({
          userId: {
            $in: contactIds
          }
        }).lean();


      const userMap =
        new Map(
          users.map(
            user => [
              user.userId,
              user
            ]
          )
        );


      const contacts =
        favoriteRows
          .map(row => {

            const user =
              userMap.get(
                row.contactUserId
              );


            if (!user) {
              return null;
            }


            return {
              user_id:
                user.userId,

              display_name:
                user.displayName,

              email:
                user.email,

              phone_number:
                user.phoneNumber,

              created_at:
                row.createdAt
            };
          })
          .filter(Boolean);


      res.json({
        success: true,
        contacts: contacts
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to load favorite contacts",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// ADD FAVORITE CONTACT
// =========================================================

app.post(
  "/api/favorite-contacts",
  async (req, res) => {
    try {

      const userId =
        Number(
          req.body.userId
        );

      const contactUserId =
        Number(
          req.body.contactUserId
        );


      if (
        !userId ||
        !contactUserId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "userId and contactUserId are required"
        });
      }


      if (
        userId === contactUserId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot add yourself as a favorite contact"
        });
      }


      const contact =
        await User.findOne({
          userId:
            contactUserId
        }).lean();


      if (!contact) {
        return res.status(404).json({
          success: false,
          message:
            "Contact user not found"
        });
      }


      await FavoriteContact.updateOne(
        {
          userId:
            userId,

          contactUserId:
            contactUserId
        },

        {
          $setOnInsert: {
            userId:
              userId,

            contactUserId:
              contactUserId
          }
        },

        {
          upsert: true
        }
      );


      res.json({
        success: true,
        message:
          "Favorite contact added"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to add favorite contact",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// REMOVE FAVORITE CONTACT
// =========================================================

app.delete(
  "/api/favorite-contacts/:userId/:contactUserId",

  async (req, res) => {
    try {

      const userId =
        Number(
          req.params.userId
        );

      const contactUserId =
        Number(
          req.params.contactUserId
        );


      await FavoriteContact.deleteOne({
        userId:
          userId,

        contactUserId:
          contactUserId
      });


      res.json({
        success: true,
        message:
          "Favorite contact removed"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to remove favorite contact",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// NOTIFY FAVORITE FRIENDS
// In-app notification + real SMS attempt
// =========================================================

app.post(
  "/api/favorite-contacts/notify",

  async (req, res) => {
    try {

      const {
        userId,
        message
      } = req.body;


      const numericUserId =
        Number(userId);


      const cleanMessage =
        String(
          message || ""
        ).trim();


      if (
        !numericUserId ||
        !cleanMessage
      ) {
        return res.status(400).json({
          success: false,
          message:
            "userId and message are required"
        });
      }


      if (
        cleanMessage.length > 240
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Message must be 240 characters or less"
        });
      }


      // Verify logged-in user
      const decoded =
        readBearerUser(req);


      if (
        Number(decoded.id) !==
        numericUserId
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only notify contacts from your own account"
        });
      }


      const sender =
        await User.findOne({
          userId:
            numericUserId
        }).lean();


      if (!sender) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }


      const favorites =
        await FavoriteContact.find({
          userId:
            numericUserId
        }).lean();


      if (
        favorites.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please add at least one favourite contact first"
        });
      }


      const favoriteIds =
        favorites.map(
          row =>
            row.contactUserId
        );


      const contacts =
        await User.find({
          userId: {
            $in:
              favoriteIds
          }
        }).lean();


      const notificationMessage =
        `${sender.displayName} says: ${cleanMessage}`;


      const smsResults = [];


      for (
        const contact of contacts
      ) {

        // ---------------------------------------
        // Create Chefy in-app notification
        // ---------------------------------------

        await createNotification({
          senderUserId:
            numericUserId,

          receiverUserId:
            contact.userId,

          message:
            notificationMessage
        });


        // ---------------------------------------
        // Attempt real SMS
        // ---------------------------------------

        const smsResult =
          await sendChefySms(
            contact.phoneNumber,
            notificationMessage
          );


        smsResults.push({
          userId:
            contact.userId,

          displayName:
            contact.displayName,

          phoneNumber:
            contact.phoneNumber ||
            null,

          smsSuccess:
            smsResult.success,

          smsSkipped:
            smsResult.skipped ||
            false,

          reason:
            smsResult.reason ||
            null,

          sid:
            smsResult.sid ||
            null
        });
      }


      const smsSentCount =
        smsResults.filter(
          item =>
            item.smsSuccess
        ).length;


      res.json({
        success: true,

        message:
          "Message sent as in-app notification to " +
          contacts.length +
          " favourite contact" +
          (
            contacts.length === 1
              ? ""
              : "s"
          ) +
          ". SMS sent to " +
          smsSentCount +
          " contact" +
          (
            smsSentCount === 1
              ? ""
              : "s"
          ) +
          ".",

        notificationsCreated:
          contacts.length,

        smsSentCount:
          smsSentCount,

        smsResults:
          smsResults
      });

    } catch (error) {

      if (
        error.message ===
        "LOGIN_REQUIRED"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Please login first"
        });
      }


      res.status(500).json({
        success: false,
        message:
          "Failed to notify favourite contacts",
        error:
          error.message
      });
    }
  }
);
// =========================================================
// GET ALL INGREDIENTS
// =========================================================


       app.get(
  "/api/ingredients",
  async (req, res) => {
    try {

      const recipes = await Recipe.find({}).lean();

      const ingredientSet = new Set();

      for (const recipe of recipes) {

        for (const rawIngredient of recipe.ingredients || []) {

          const cleaned = normalizeIngredient(rawIngredient);

          if (cleaned) {
            ingredientSet.add(cleaned);
          }
        }
      }

      const ingredientNames =
        [...ingredientSet].sort();

      const ingredients =
        ingredientNames.map(
          (name, index) => ({
            ingredient_id: index + 1,
            ingredient_name: name
          })
        );

      res.json({
        success: true,
        ingredients: ingredients
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to load ingredients",
        error: error.message
      });
    }
  }
);



// =========================================================
// GENERATE RECIPES FROM SELECTED INGREDIENTS
// =========================================================

app.post(
  "/api/recipes/generate",
  async (req, res) => {
    try {

      const {
        selectedIngredients,
        userId
      } = req.body;


      if (
        !selectedIngredients ||
        !Array.isArray(
          selectedIngredients
        ) ||
        selectedIngredients.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select at least one ingredient"
        });
      }


      // -----------------------------------------
      // Clean ingredient names
      // -----------------------------------------

      const cleanIngredients = [
        ...new Set(
          selectedIngredients
            .map(
              normalizeIngredient
            )
            .filter(Boolean)
        )
      ];


      // -----------------------------------------
      // Save user's ingredient search history
      //
      // This supports your Chefy data-mining idea:
      // repeated ingredient selections can later
      // influence the For You recommendations.
      // -----------------------------------------

      if (userId) {

        await IngredientSearch.create({
          userId:
            Number(userId),

          ingredients:
            cleanIngredients
        });
      }


      // -----------------------------------------
      // Find MongoDB recipes containing
      // at least one selected ingredient
      // -----------------------------------------

      const recipes =
        await Recipe.find({
          ageGroup: null,

          ingredients: {
            $in:
              cleanIngredients
          }
        }).lean();


      // -----------------------------------------
      // Calculate match score
      // -----------------------------------------

      const ranked =
        recipes
          .map(recipe => {

            const recipeIngredientSet =
              new Set(
                (
                  recipe.ingredients ||
                  []
                ).map(
                  normalizeIngredient
                )
              );


            const matched =
              cleanIngredients.filter(
                ingredient =>
                  recipeIngredientSet.has(
                    ingredient
                  )
              );


            return {
              ...formatRecipeListItem(
                recipe
              ),

              match_count:
                matched.length,

              matched_ingredients:
                matched
                  .sort()
                  .join(", ")
            };
          })


          // -------------------------------------
          // Recipes with more matches appear first
          // -------------------------------------

          .sort(
            (a, b) =>
              b.match_count -
                a.match_count ||

              a.recipe_name.localeCompare(
                b.recipe_name
              )
          );


      res.json({
        success: true,

        selectedIngredients:
          cleanIngredients,

        recipes:
          ranked
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to generate recipes",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// GET ALL RECIPES
// From your MongoDB Recipe collection
// =========================================================

app.get(
  "/api/recipes",
  async (req, res) => {
    try {

      const recipes =
        await Recipe
          .find({})
          .sort({
            name: 1
          })
          .lean();


      res.json({
        success: true,

        recipes:
          recipes.map(
            recipe =>
              formatRecipeListItem(
                recipe
              )
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to load recipes",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// GET RECIPES BY AGE GROUP
// Used for Kid Foods
// =========================================================

app.get(
  "/api/recipes/age/:ageGroup",
  async (req, res) => {
    try {

      const ageGroup =
        decodeURIComponent(
          req.params.ageGroup
        );


      const recipes =
        await Recipe
          .find({
            ageGroup:
              ageGroup
          })
          .sort({
            name: 1
          })
          .lean();


      res.json({
        success: true,

        ageGroup:
          ageGroup,

        recipes:
          recipes.map(
            recipe =>
              formatRecipeListItem(
                recipe
              )
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to load recipes by age group",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// DAILY MEAL RECIPES
// =========================================================

app.get(
  "/api/recipes-daily",
  async (req, res) => {
    try {

      const recipes =
        await Recipe
          .find({
            ageGroup: null
          })
          .sort({
            name: 1
          })
          .lean();


      res.json({
        success: true,

        recipes:
          recipes.map(
            recipe =>
              formatRecipeListItem(
                recipe
              )
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to load daily meal recipes",
        error:
          error.message
      });
    }
  }
);


// =========================================================
// GET ONE RECIPE + COOKING STEPS
// IMPORTANT: Keep this AFTER /api/recipes/age/:ageGroup
// =========================================================

app.get(
  "/api/recipes/:recipeId",
  async (req, res) => {
    try {

      const recipe =
        await Recipe.findOne({
          recipeId:
            req.params.recipeId
        }).lean();


      if (!recipe) {
        return res.status(404).json({
          success: false,
          message:
            "Recipe not found"
        });
      }


      res.json({
        success: true,

        recipe:
          formatRecipeDetail(
            recipe
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to load recipe",
        error:
          error.message
      });
    }
  }
);
// =========================================================
// RECORD FINISHED COOKING
// + CREATE NOTIFICATIONS FOR FAVOURITE CONTACTS
// =========================================================

app.post(
  "/api/completions",
  async (req, res) => {
    try {

      const userId =
        Number(
          req.body.userId
        );

      const recipeId =
        String(
          req.body.recipeId || ""
        ).trim();


      if (
        !userId ||
        !recipeId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "userId and recipeId are required"
        });
      }


      const [
        user,
        recipe
      ] =
        await Promise.all([
          User.findOne({
            userId: userId
          }).lean(),

          Recipe.findOne({
            recipeId: recipeId
          }).lean()
        ]);


      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }


      if (!recipe) {
        return res.status(404).json({
          success: false,
          message:
            "Recipe not found"
        });
      }


      // -----------------------------------------
      // Save cooking completion in MongoDB
      // -----------------------------------------

      await RecipeCompletion.create({
        userId:
          userId,

        recipeId:
          recipeId
      });


      // -----------------------------------------
      // Get user's favourite contacts
      // -----------------------------------------

      const favorites =
        await FavoriteContact.find({
          userId:
            userId
        }).lean();


      const message =
        `${user.displayName} has finished cooking ${recipe.name} in Chefy. ` +
        "Tell them to cook for u now!!!";


      // -----------------------------------------
      // Create notification for each contact
      // -----------------------------------------

      for (
        const contact of favorites
      ) {

        await createNotification({
          senderUserId:
            userId,

          receiverUserId:
            contact.contactUserId,

          recipeId:
            recipeId,

          message:
            message
        });
      }


      res.json({
        success: true,

        message:
          "Recipe completion recorded and notifications created",

        notificationsCreated:
          favorites.length
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to record recipe completion",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// GET NOTIFICATIONS FOR ONE USER
// =========================================================

app.get(
  "/api/notifications/:userId",
  async (req, res) => {
    try {

      const userId =
        Number(
          req.params.userId
        );


      const notifications =
        await Notification
          .find({
            receiverUserId:
              userId
          })
          .sort({
            createdAt: -1
          })
          .lean();


      // -----------------------------------------
      // Collect sender IDs
      // -----------------------------------------

      const senderIds = [
        ...new Set(
          notifications.map(
            item =>
              item.senderUserId
          )
        )
      ];


      // -----------------------------------------
      // Collect recipe IDs
      // -----------------------------------------

      const recipeIds = [
        ...new Set(
          notifications
            .map(
              item =>
                item.recipeId
            )
            .filter(Boolean)
        )
      ];


      const [
        senders,
        recipes
      ] =
        await Promise.all([

          User.find({
            userId: {
              $in:
                senderIds
            }
          }).lean(),

          Recipe.find({
            recipeId: {
              $in:
                recipeIds
            }
          }).lean()

        ]);


      // -----------------------------------------
      // Build lookup maps
      // -----------------------------------------

      const senderMap =
        new Map(
          senders.map(
            user => [
              user.userId,
              user.displayName
            ]
          )
        );


      const recipeMap =
        new Map(
          recipes.map(
            recipe => [
              recipe.recipeId,
              recipe.name
            ]
          )
        );


      // -----------------------------------------
      // Count unread notifications
      // -----------------------------------------

      const unreadCount =
        notifications.filter(
          item =>
            !item.isRead
        ).length;


      res.json({
        success: true,

        unreadCount:
          unreadCount,

        notifications:
          notifications.map(
            item => ({

              notification_id:
                item.notificationId,

              sender_user_id:
                item.senderUserId,

              sender_name:
                senderMap.get(
                  item.senderUserId
                ) ||
                "Chefy User",

              receiver_user_id:
                item.receiverUserId,

              recipe_id:
                item.recipeId,

              recipe_name:
                item.recipeId
                  ? (
                      recipeMap.get(
                        item.recipeId
                      ) ||
                      null
                    )
                  : null,

              message:
                item.message,

              is_read:
                item.isRead,

              created_at:
                item.createdAt

            })
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load notifications",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// MARK ONE NOTIFICATION AS READ
// =========================================================

app.patch(
  "/api/notifications/:notificationId/read",
  async (req, res) => {
    try {

      const notificationId =
        Number(
          req.params.notificationId
        );


      await Notification.updateOne(
        {
          notificationId:
            notificationId
        },

        {
          $set: {
            isRead: true
          }
        }
      );


      res.json({
        success: true,
        message:
          "Notification marked as read"
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to mark notification as read",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// MARK ALL NOTIFICATIONS AS READ
// =========================================================

app.patch(
  "/api/notifications/:userId/read-all",
  async (req, res) => {
    try {

      const userId =
        Number(
          req.params.userId
        );


      await Notification.updateMany(
        {
          receiverUserId:
            userId
        },

        {
          $set: {
            isRead: true
          }
        }
      );


      res.json({
        success: true,
        message:
          "All notifications marked as read"
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to mark notifications as read",

        error:
          error.message
      });
    }
  }
);
// =========================================================
// POPULAR RECIPES
// A recipe becomes popular when at least 20 unique users
// have finished cooking it.
// =========================================================

app.get(
  "/api/popular-recipes",
  async (req, res) => {
    try {

      const grouped =
        await RecipeCompletion.aggregate([
          {
            $group: {
              _id: "$recipeId",

              users: {
                $addToSet: "$userId"
              }
            }
          },

          {
            $project: {
              recipeId: "$_id",

              finishedUsers: {
                $size: "$users"
              }
            }
          },

          {
            $match: {
              finishedUsers: {
                $gte: 20
              }
            }
          },

          {
            $sort: {
              finishedUsers: -1
            }
          }
        ]);


      const recipeIds =
        grouped.map(
          row => row.recipeId
        );


      const recipes =
        await Recipe.find({
          recipeId: {
            $in: recipeIds
          }
        }).lean();


      const recipeMap =
        new Map(
          recipes.map(
            recipe => [
              recipe.recipeId,
              recipe
            ]
          )
        );


      const popularRecipes =
        grouped
          .map(row => {

            const recipe =
              recipeMap.get(
                row.recipeId
              );


            if (!recipe) {
              return null;
            }


            return {
              recipe_id:
                recipe.recipeId,

              recipe_name:
                recipe.name,

              age_group:
                recipe.ageGroup ?? null,

              short_advantages:
                recipe.shortAdvantages || "",

              finished_users:
                row.finishedUsers
            };
          })
          .filter(Boolean);


      res.json({
        success: true,

        popularRecipes:
          popularRecipes
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load popular recipes",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// CHEFY GENERAL INSIGHTS
// =========================================================

app.get(
  "/api/insights",
  async (req, res) => {
    try {

      const [
        totalRecipes,
        totalUsers,
        totalCompletions
      ] =
        await Promise.all([

          Recipe.countDocuments({}),

          User.countDocuments({}),

          RecipeCompletion.countDocuments({})

        ]);


      const grouped =
        await RecipeCompletion.aggregate([
          {
            $group: {
              _id: "$recipeId",

              users: {
                $addToSet: "$userId"
              }
            }
          },

          {
            $project: {
              recipeId: "$_id",

              finishedUsers: {
                $size: "$users"
              }
            }
          },

          {
            $match: {
              finishedUsers: {
                $gte: 20
              }
            }
          },

          {
            $sort: {
              finishedUsers: -1
            }
          }
        ]);


      const recipeIds =
        grouped.map(
          row => row.recipeId
        );


      const recipes =
        await Recipe.find({
          recipeId: {
            $in: recipeIds
          }
        }).lean();


      const recipeMap =
        new Map(
          recipes.map(
            recipe => [
              recipe.recipeId,
              recipe
            ]
          )
        );


      const popularRecipes =
        grouped
          .map(row => {

            const recipe =
              recipeMap.get(
                row.recipeId
              );


            if (!recipe) {
              return null;
            }


            return {
              recipe_id:
                recipe.recipeId,

              recipe_name:
                recipe.name,

              finished_users:
                row.finishedUsers
            };
          })
          .filter(Boolean);


      res.json({
        success: true,

        totalRecipes:
          totalRecipes,

        totalUsers:
          totalUsers,

        totalCompletions:
          totalCompletions,

        popularRecipes:
          popularRecipes
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load insights",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// ADMIN DASHBOARD
//
// Admin can see:
// - users
// - login frequency
// - last login
// - repeatedly selected ingredients
//
// Ingredient becomes a favourite after being
// selected at least 3 times.
// =========================================================

app.get(
  "/api/admin/dashboard",

  requireAdmin,

  async (req, res) => {
    try {

      const users =
        await User.find({})
          .sort({
            userId: 1
          })
          .lean();


      const searches =
        await IngredientSearch
          .find({})
          .lean();


      // -----------------------------------------
      // Count ingredient selections per user
      // -----------------------------------------

      const userIngredientCounts =
        new Map();


      for (
        const search of searches
      ) {

        if (
          !userIngredientCounts.has(
            search.userId
          )
        ) {

          userIngredientCounts.set(
            search.userId,
            new Map()
          );
        }


        const counts =
          userIngredientCounts.get(
            search.userId
          );


        for (
          const ingredient of
          search.ingredients || []
        ) {

          const name =
            normalizeIngredient(
              ingredient
            );


          if (!name) {
            continue;
          }


          counts.set(
            name,

            (
              counts.get(name) ||
              0
            ) + 1
          );
        }
      }


      // -----------------------------------------
      // Build dashboard data
      // -----------------------------------------

      const result =
        users.map(user => {

          const counts =
            userIngredientCounts.get(
              user.userId
            ) ||
            new Map();


          const favorites =
            [...counts.entries()]

              // Chefy rule:
              // ingredient selected 3+ times
              .filter(
                ([, count]) =>
                  count >= 3
              )

              .sort(
                (a, b) =>
                  b[1] - a[1] ||
                  a[0].localeCompare(
                    b[0]
                  )
              )

              .map(
                ([name, count]) =>
                  `${name} (${count})`
              );


          return {

            user_id:
              user.userId,

            display_name:
              user.displayName,

            email:
              user.email,

            phone_number:
              user.phoneNumber,

            role:
              user.role,

            login_count:
              user.loginCount || 0,

            last_login_at:
              user.lastLoginAt,

            favorite_ingredients:
              favorites.length > 0
                ? favorites.join(", ")
                : "No favourite yet"
          };
        });


      res.json({
        success: true,

        totalUsers:
          users.length,

        users:
          result
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load admin dashboard",

        error:
          error.message
      });
    }
  }
);
// =========================================================
// FOR YOU RECOMMENDATION
//
// Rule:
// If a user selects the same ingredient at least 3 times,
// recipes containing that ingredient are recommended.
//
// This is Chefy's behaviour-based personalization.
// =========================================================

app.get(
  "/api/for-you/:userId",

  async (req, res) => {
    try {

      const userId =
        Number(
          req.params.userId
        );


      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "Valid userId is required"
        });
      }


      // -----------------------------------------
      // Get user's ingredient-selection history
      // -----------------------------------------

      const searches =
        await IngredientSearch
          .find({
            userId: userId
          })
          .lean();


      // -----------------------------------------
      // Count how many times each ingredient
      // was selected
      // -----------------------------------------

      const ingredientCounts =
        new Map();


      for (
        const search of searches
      ) {

        for (
          const ingredient of
          search.ingredients || []
        ) {

          const name =
            normalizeIngredient(
              ingredient
            );


          if (!name) {
            continue;
          }


          ingredientCounts.set(
            name,

            (
              ingredientCounts.get(
                name
              ) || 0
            ) + 1
          );
        }
      }


      // -----------------------------------------
      // Favourite ingredients
      // Selected at least 3 times
      // -----------------------------------------

      const favouriteIngredients =
        [...ingredientCounts.entries()]

          .filter(
            ([, count]) =>
              count >= 3
          )

          .sort(
            (a, b) =>
              b[1] - a[1]
          );


      // -----------------------------------------
      // If user has no behaviour pattern yet,
      // return normal Daily Meal suggestions
      // -----------------------------------------

      if (
        favouriteIngredients.length === 0
      ) {

        const fallbackRecipes =
          await Recipe
            .find({
              ageGroup: null
            })
            .sort({
              createdAt: -1
            })
            .limit(20)
            .lean();


        return res.json({
          success: true,

          personalized:
            false,

          reason:
            "Not enough ingredient history yet",

          favouriteIngredients:
            [],

          recipes:
            fallbackRecipes.map(
              recipe =>
                formatRecipeListItem(
                  recipe,
                  {
                    recommendation_score:
                      0
                  }
                )
            )
        });
      }


      // -----------------------------------------
      // Extract ingredient names only
      // -----------------------------------------

      const favouriteNames =
        favouriteIngredients.map(
          ([name]) => name
        );


      // -----------------------------------------
      // Find recipes containing user's
      // favourite ingredients
      // -----------------------------------------

      const candidateRecipes =
        await Recipe
          .find({
            ageGroup: null,

            ingredients: {
              $in:
                favouriteNames
            }
          })
          .lean();


      // -----------------------------------------
      // Build weighted recommendation score
      //
      // Example:
      // chicken selected 5 times = 5 points
      // potato selected 3 times = 3 points
      //
      // Recipe containing both = 8 points
      // -----------------------------------------

      const rankedRecipes =
        candidateRecipes
          .map(recipe => {

            const recipeIngredients =
              new Set(
                (
                  recipe.ingredients ||
                  []
                ).map(
                  normalizeIngredient
                )
              );


            let score = 0;

            const matchedPreferences =
              [];


            for (
              const [
                ingredient,
                count
              ] of favouriteIngredients
            ) {

              if (
                recipeIngredients.has(
                  ingredient
                )
              ) {

                score +=
                  count;


                matchedPreferences.push({
                  ingredient:
                    ingredient,

                  selectionCount:
                    count
                });
              }
            }


            return {
              ...formatRecipeListItem(
                recipe
              ),

              recommendation_score:
                score,

              matched_preferences:
                matchedPreferences
            };
          })


          // -------------------------------------
          // Highest personalization score first
          // -------------------------------------

          .sort(
            (a, b) =>
              b.recommendation_score -
                a.recommendation_score ||

              a.recipe_name.localeCompare(
                b.recipe_name
              )
          );


      res.json({
        success: true,

        personalized:
          true,

        favouriteIngredients:
          favouriteIngredients.map(
            ([name, count]) => ({
              ingredient:
                name,

              selectionCount:
                count
            })
          ),

        recipes:
          rankedRecipes
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load For You recommendations",

        error:
          error.message
      });
    }
  }
);
// =========================================================
// ADMIN — ADD NEW RECIPE
// MongoDB version
// =========================================================

app.post(
  "/api/admin/recipes",

  requireAdmin,

  async (req, res) => {
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


      // -----------------------------------------
      // Basic validation
      // -----------------------------------------

      if (
        !recipeId ||
        !recipeName ||
        !category
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Recipe ID, recipe name, and category are required"
        });
      }


      if (
        !Array.isArray(ingredients) ||
        ingredients.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please add at least one ingredient"
        });
      }


      if (
        !Array.isArray(steps) ||
        steps.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please add at least one cooking step"
        });
      }


      // -----------------------------------------
      // Clean Recipe ID
      // -----------------------------------------

      const cleanRecipeId =
        String(recipeId)
          .trim()
          .toLowerCase();


      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/
          .test(cleanRecipeId)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Recipe ID must use small letters, numbers, and hyphens only"
        });
      }


      // -----------------------------------------
      // Category / age group
      // -----------------------------------------

      const cleanCategory =
        String(category).trim();


      const cleanAgeGroup =
        cleanCategory === "Daily Meals"
          ? null
          : ageGroup || null;


      if (
        cleanCategory === "Kid Foods" &&
        !cleanAgeGroup
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please choose an age group for Kid Foods"
        });
      }


      // -----------------------------------------
      // Check duplicate Recipe ID
      // -----------------------------------------

      const existing =
        await Recipe.findOne({
          recipeId:
            cleanRecipeId
        }).lean();


      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "A recipe with this ID already exists"
        });
      }


      // -----------------------------------------
      // Clean ingredients
      // -----------------------------------------

      const cleanIngredients = [
        ...new Set(
          ingredients
            .map(
              normalizeIngredient
            )
            .filter(Boolean)
        )
      ];


      // -----------------------------------------
      // Clean cooking steps
      // -----------------------------------------

      const cleanSteps =
        steps
          .map(
            item =>
              String(item)
                .trim()
          )
          .filter(Boolean);


      // -----------------------------------------
      // Save recipe directly into MongoDB
      // -----------------------------------------

      await Recipe.create({

        recipeId:
          cleanRecipeId,

        name:
          String(recipeName)
            .trim(),

        category:
          cleanCategory,

        ageGroup:
          cleanAgeGroup,

        image:
          "",

        ingredients:
          cleanIngredients,

        steps:
          cleanSteps,

        shortAdvantages:
          shortAdvantages || "",

        advantages:
          advantages || ""
      });


      // -----------------------------------------
      // Update ingredient collection
      // -----------------------------------------

      await syncIngredientsFromRecipes();


      res.json({
        success: true,

        message:
          "Recipe added successfully",

        recipeId:
          cleanRecipeId
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to add recipe",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// COMMUNITY USER — SUBMIT OWN RECIPE
// Admin will review before publication
// =========================================================

app.post(
  "/api/community-recipes",

  async (req, res) => {
    try {

      const decoded =
        readBearerUser(req);


      const {
        recipeName,
        description,
        ingredientIds,
        ingredients: ingredientNames,
        steps,
        prepTimeMinutes,
        cookTimeMinutes,
        servings,
        imageUrl
      } = req.body || {};


      const cleanName =
        String(
          recipeName || ""
        ).trim();


      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message:
            "Recipe name is required"
        });
      }


      // -----------------------------------------
      // Clean cooking steps
      // -----------------------------------------

      const cleanSteps =
        Array.isArray(steps)
          ? steps
              .map(
                item =>
                  String(
                    item || ""
                  ).trim()
              )
              .filter(Boolean)
          : [];


      if (
        cleanSteps.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please add at least one cooking step"
        });
      }


      // -----------------------------------------
      // Prepare ingredients
      // -----------------------------------------

      let selectedIngredients = [];


      // User selected existing ingredient IDs
      if (
        Array.isArray(
          ingredientIds
        ) &&
        ingredientIds.length > 0
      ) {

        const numericIds = [
          ...new Set(
            ingredientIds
              .map(Number)
              .filter(
                Number.isFinite
              )
          )
        ];


        const rows =
          await Ingredient.find({
            ingredientId: {
              $in:
                numericIds
            }
          }).lean();


        if (
          rows.length !==
          numericIds.length
        ) {
          return res.status(400).json({
            success: false,
            message:
              "One or more selected ingredients are invalid"
          });
        }


        selectedIngredients =
          rows.map(
            row => ({
              ingredient_id:
                row.ingredientId,

              ingredient_name:
                row.ingredientName
            })
          );

      } else if (
        Array.isArray(
          ingredientNames
        ) &&
        ingredientNames.length > 0
      ) {

        // ---------------------------------------
        // User supplied ingredient names
        // ---------------------------------------

        for (
          const rawName of
          ingredientNames
        ) {

          const ingredientName =
            normalizeIngredient(
              rawName
            );


          if (!ingredientName) {
            continue;
          }


          let ingredient =
            await Ingredient.findOne({
              ingredientName:
                ingredientName
            });


          // New ingredient can become part
          // of Chefy's growing dataset
          if (!ingredient) {

            const ingredientId =
              await nextSequence(
                "ingredientId"
              );


            ingredient =
              await Ingredient.create({
                ingredientId:
                  ingredientId,

                ingredientName:
                  ingredientName
              });
          }


          selectedIngredients.push({
            ingredient_id:
              ingredient.ingredientId,

            ingredient_name:
              ingredient.ingredientName
          });
        }
      }


      if (
        selectedIngredients.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please choose at least one ingredient"
        });
      }


      // -----------------------------------------
      // Generate submission ID
      // -----------------------------------------

      const submissionId =
        await nextSequence(
          "submissionId"
        );


      // -----------------------------------------
      // Store submission in MongoDB
      // Status remains PENDING
      // -----------------------------------------

      await CommunityRecipeSubmission.create({

        submissionId:
          submissionId,

        userId:
          Number(decoded.id),

        recipeName:
          cleanName,

        description:
          String(
            description || ""
          ).trim(),

        ingredients:
          selectedIngredients,

        steps:
          cleanSteps,

        prepTimeMinutes:
          Number(
            prepTimeMinutes
          ) || null,

        cookTimeMinutes:
          Number(
            cookTimeMinutes
          ) || null,

        servings:
          Number(
            servings
          ) || null,

        imageUrl:
          String(
            imageUrl || ""
          ).trim() || null,

        status:
          "pending"
      });


      res.status(201).json({
        success: true,

        message:
          "Recipe submitted successfully and is waiting for admin review.",

        submissionId:
          submissionId,

        status:
          "pending"
      });

    } catch (error) {

      if (
        error.message ===
        "LOGIN_REQUIRED"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Please login before submitting a recipe"
        });
      }


      res.status(500).json({
        success: false,

        message:
          "Failed to submit recipe",

        error:
          error.message
      });
    }
  }
);
// =========================================================
// COMMUNITY USER — VIEW OWN SUBMISSIONS
// =========================================================

app.get(
  "/api/community-recipes/mine",

  async (req, res) => {
    try {

      const decoded =
        readBearerUser(req);


      const rows =
        await CommunityRecipeSubmission
          .find({
            userId:
              Number(decoded.id)
          })
          .sort({
            createdAt: -1
          })
          .lean();


      res.json({
        success: true,

        submissions:
          rows.map(
            row => ({
              submission_id:
                row.submissionId,

              recipe_name:
                row.recipeName,

              description:
                row.description,

              ingredients:
                row.ingredients,

              steps:
                row.steps,

              prep_time_minutes:
                row.prepTimeMinutes,

              cook_time_minutes:
                row.cookTimeMinutes,

              servings:
                row.servings,

              image_url:
                row.imageUrl,

              status:
                row.status,

              admin_note:
                row.adminNote,

              approved_recipe_id:
                row.approvedRecipeId,

              submitted_at:
                row.createdAt,

              reviewed_at:
                row.reviewedAt
            })
          )
      });

    } catch (error) {

      if (
        error.message ===
        "LOGIN_REQUIRED"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Please login first"
        });
      }


      res.status(500).json({
        success: false,

        message:
          "Failed to load your recipe submissions",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// PUBLIC — VIEW APPROVED COMMUNITY RECIPES
// =========================================================

app.get(
  "/api/community-recipes/approved",

  async (req, res) => {
    try {

      const rows =
        await CommunityRecipeSubmission
          .find({
            status:
              "approved",

            approvedRecipeId: {
              $ne: null
            }
          })
          .sort({
            reviewedAt: -1
          })
          .lean();


      const userIds = [
        ...new Set(
          rows.map(
            row =>
              row.userId
          )
        )
      ];


      const users =
        await User.find({
          userId: {
            $in:
              userIds
          }
        }).lean();


      const userMap =
        new Map(
          users.map(
            user => [
              user.userId,
              user.displayName
            ]
          )
        );


      res.json({
        success: true,

        recipes:
          rows.map(
            row => ({

              id:
                row.approvedRecipeId,

              name:
                row.recipeName,

              category:
                "Daily Meals",

              ageGroup:
                null,

              image:
                row.imageUrl || "",

              ingredients:
                row.ingredients.map(
                  item =>
                    item.ingredient_name
                ),

              steps:
                row.steps,

              shortAdvantages:
                row.description ||
                "Community recipe submitted by a Chefy user.",

              advantages:
                row.description ||
                "Community recipe submitted by a Chefy user.",

              submittedBy:
                userMap.get(
                  row.userId
                ) ||
                "Chefy User",

              communityRecipe:
                true
            })
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load approved community recipes",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// ADMIN — VIEW ALL COMMUNITY SUBMISSIONS
// =========================================================

app.get(
  "/api/admin/community-recipes",

  requireAdmin,

  async (req, res) => {
    try {

      const rows =
        await CommunityRecipeSubmission
          .find({})
          .sort({
            status: 1,
            createdAt: -1
          })
          .lean();


      const userIds = [
        ...new Set(
          rows.map(
            row =>
              row.userId
          )
        )
      ];


      const users =
        await User.find({
          userId: {
            $in:
              userIds
          }
        }).lean();


      const userMap =
        new Map(
          users.map(
            user => [
              user.userId,
              user
            ]
          )
        );


      res.json({
        success: true,

        submissions:
          rows.map(
            row => {

              const user =
                userMap.get(
                  row.userId
                );


              return {

                submission_id:
                  row.submissionId,

                user_id:
                  row.userId,

                recipe_name:
                  row.recipeName,

                description:
                  row.description,

                ingredients:
                  row.ingredients,

                steps:
                  row.steps,

                prep_time_minutes:
                  row.prepTimeMinutes,

                cook_time_minutes:
                  row.cookTimeMinutes,

                servings:
                  row.servings,

                image_url:
                  row.imageUrl,

                status:
                  row.status,

                admin_note:
                  row.adminNote,

                approved_recipe_id:
                  row.approvedRecipeId,

                submitted_at:
                  row.createdAt,

                reviewed_at:
                  row.reviewedAt,

                reviewed_by:
                  row.reviewedBy,

                display_name:
                  user
                    ? user.displayName
                    : "Unknown user",

                email:
                  user
                    ? user.email
                    : ""
              };
            }
          )
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to load recipe submissions",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// ADMIN — APPROVE COMMUNITY RECIPE
// Approved recipe is copied into main Recipe collection
// =========================================================

app.patch(
  "/api/admin/community-recipes/:submissionId/approve",

  requireAdmin,

  async (req, res) => {
    try {

      const submissionId =
        Number(
          req.params.submissionId
        );


      if (
        !Number.isFinite(
          submissionId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid submission ID"
        });
      }


      const submission =
        await CommunityRecipeSubmission
          .findOne({
            submissionId:
              submissionId
          });


      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Recipe submission not found"
        });
      }


      if (
        submission.status !==
        "pending"
      ) {
        return res.status(409).json({
          success: false,
          message:
            `This recipe is already ${submission.status}`
        });
      }


      const recipeId =
        makeCommunityRecipeId(
          submission.recipeName,
          submissionId
        );


      const existingRecipe =
        await Recipe.findOne({
          recipeId:
            recipeId
        }).lean();


      if (existingRecipe) {
        return res.status(409).json({
          success: false,
          message:
            "Published recipe ID already exists"
        });
      }


      // -----------------------------------------
      // Publish approved recipe
      // -----------------------------------------

      await Recipe.create({

        recipeId:
          recipeId,

        name:
          submission.recipeName,

        category:
          "Daily Meals",

        ageGroup:
          null,

        image:
          submission.imageUrl || "",

        ingredients:
          submission.ingredients.map(
            item =>
              item.ingredient_name
          ),

        steps:
          submission.steps,

        shortAdvantages:
          submission.description ||
          "Community recipe submitted by a Chefy user.",

        advantages:
          submission.description ||
          "Community recipe submitted by a Chefy user."
      });


      // -----------------------------------------
      // Update submission status
      // -----------------------------------------

      submission.status =
        "approved";

      submission.approvedRecipeId =
        recipeId;

      submission.reviewedAt =
        new Date();

      submission.reviewedBy =
        req.user.id;

      submission.adminNote =
        String(
          (req.body || {}).adminNote || ""
        ).trim() || null;


      await submission.save();


      // -----------------------------------------
      // Notify submitter
      // -----------------------------------------

      await createNotification({

        senderUserId:
          req.user.id,

        receiverUserId:
          submission.userId,

        recipeId:
          recipeId,

        message:
          `Your recipe “${submission.recipeName}” has been approved and is now available on Chefy!`
      });


      await syncIngredientsFromRecipes();


      res.json({
        success: true,

        message:
          "Recipe approved and published successfully.",

        recipeId:
          recipeId
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to approve recipe",

        error:
          error.message
      });
    }
  }
);


// =========================================================
// ADMIN — REJECT COMMUNITY RECIPE
// =========================================================

app.patch(
  "/api/admin/community-recipes/:submissionId/reject",

  requireAdmin,

  async (req, res) => {
    try {

      const submissionId =
        Number(
          req.params.submissionId
        );


      if (
        !Number.isFinite(
          submissionId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid submission ID"
        });
      }


      const submission =
        await CommunityRecipeSubmission
          .findOne({
            submissionId:
              submissionId
          });


      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Recipe submission not found"
        });
      }


      if (
        submission.status !==
        "pending"
      ) {
        return res.status(409).json({
          success: false,
          message:
            `This recipe is already ${submission.status}`
        });
      }


      const note =
        String(
          (req.body || {}).adminNote || ""
        ).trim();


      submission.status =
        "rejected";

      submission.reviewedAt =
        new Date();

      submission.reviewedBy =
        req.user.id;

      submission.adminNote =
        note || null;


      await submission.save();


      await createNotification({

        senderUserId:
          req.user.id,

        receiverUserId:
          submission.userId,

        message:
          `Your recipe “${submission.recipeName}” was reviewed but was not approved.` +
          (
            note
              ? " Note: " + note
              : ""
          )
      });


      res.json({
        success: true,
        message:
          "Recipe submission rejected."
      });

    } catch (error) {

      res.status(500).json({
        success: false,

        message:
          "Failed to reject recipe",

        error:
          error.message
      });
    }
  }
);
// =========================================================
// START CHEFY SERVER
// MongoDB / NoSQL ONLY
// =========================================================

const PORT =
  process.env.PORT || 5000;


async function startServer() {
  try {

    // -----------------------------------------
    // Check required environment variables
    // -----------------------------------------

    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from .env"
      );
    }


    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing from .env"
      );
    }


    // -----------------------------------------
    // Connect to MongoDB Atlas
    // -----------------------------------------

    await mongoose.connect(
      process.env.MONGODB_URI
    );


    console.log(
      "MongoDB connected successfully"
    );


    // -----------------------------------------
    // Build / update ingredient index
    // from your 275 recipe documents
    // -----------------------------------------

    await syncIngredientsFromRecipes();


    // -----------------------------------------
    // Start Express server
    // -----------------------------------------

    app.listen(
      PORT,
      () => {
        console.log(
          `Chefy MongoDB backend running on port ${PORT}`
        );
      }
    );

  } catch (error) {

    console.error(
      "Chefy backend failed to start:",
      error.message
    );


    process.exit(1);
  }
}
app.post(
  "/api/admin/rebuild-ingredients",
  requireAdmin,
  async (req, res) => {
    try {

      await Ingredient.deleteMany({});

      await Counter.updateOne(
        { key: "ingredientId" },
        { $set: { seq: 0 } },
        { upsert: true }
      );

      await syncIngredientsFromRecipes();

      const totalIngredients =
        await Ingredient.countDocuments({});

      res.json({
        success: true,
        message: "Ingredient collection rebuilt successfully",
        totalIngredients
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Failed to rebuild ingredients",
        error: error.message
      });
    }
  }
);

startServer();
