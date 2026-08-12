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
      ? [...new Set(
          ingredientIds
            .map(Number)
            .filter(Number.isFinite)
        )]
      : [];

    const cleanSteps = Array.isArray(steps)
      ? steps
          .map(item => String(item || "").trim())
          .filter(Boolean)
      : [];

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Recipe name is required"
      });
    }

    if (cleanIngredientIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please choose at least one ingredient"
      });
    }

    if (cleanSteps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one cooking step"
      });
    }

    connection = await getConnection();

    await ensureCommunityRecipeTable(connection);

    const placeholders = cleanIngredientIds
      .map(() => "?")
      .join(",");

    const [ingredientRows] = await connection.execute(
      `
      SELECT
        ingredient_id,
        ingredient_name
      FROM ingredients
      WHERE ingredient_id IN (${placeholders})
      ORDER BY ingredient_name ASC
      `,
      cleanIngredientIds
    );

    if (ingredientRows.length !== cleanIngredientIds.length) {
      await connection.end();
      connection = null;

      return res.status(400).json({
        success: false,
        message: "One or more selected ingredients are invalid"
      });
    }

    const ingredients = ingredientRows.map(row => ({
      ingredient_id: row.ingredient_id,
      ingredient_name: row.ingredient_name
    }));

    const [result] = await connection.execute(
      `
      INSERT INTO user_recipe_submissions (
        user_id,
        recipe_name,
        description,
        ingredients_json,
        steps_json,
        prep_time_minutes,
        cook_time_minutes,
        servings,
        image_url,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `,
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
    connection = null;

    return res.status(201).json({
      success: true,
      message:
        "Recipe submitted successfully and is waiting for admin review.",
      submissionId: result.insertId,
      status: "pending"
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error(
          "Failed to close database connection:",
          closeError
        );
      }
    }

    console.error(
      "Community recipe submission failed:",
      error
    );

    if (error.message === "LOGIN_REQUIRED") {
      return res.status(401).json({
        success: false,
        message:
          "Please login before submitting a recipe"
      });
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Your login session has expired. Please login again."
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit recipe: " +
        error.message,
      error: error.message
    });
  }
});
