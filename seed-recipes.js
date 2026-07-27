const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

function loadRecipes() {
  const recipesPath = path.join(__dirname, "..", "recipes.js");
  const code = fs.readFileSync(recipesPath, "utf8");

  const sandbox = {
    window: {},
    console
  };

  vm.createContext(sandbox);

  vm.runInContext(
    code + `
      globalThis.__recipes =
        typeof recipes !== "undefined"
          ? recipes
          : window.recipes;
    `,
    sandbox
  );

  if (!sandbox.__recipes) {
    throw new Error("Could not find recipes object in recipes.js");
  }

  return sandbox.__recipes;
}

async function seedRecipes() {
  const recipes = loadRecipes();
  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.beginTransaction();

    for (const recipeId of Object.keys(recipes)) {
      const recipe = recipes[recipeId];

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
        ON DUPLICATE KEY UPDATE
          recipe_name = VALUES(recipe_name),
          category = VALUES(category),
          age_group = VALUES(age_group),
          short_advantages = VALUES(short_advantages),
          advantages = VALUES(advantages)
        `,
        [
          recipe.id || recipeId,
          recipe.name || "Unnamed Recipe",
          recipe.category || "Daily Meals",
          recipe.ageGroup || null,
          recipe.shortAdvantages || "",
          recipe.advantages || ""
        ]
      );

      await connection.execute(
        "DELETE FROM recipe_ingredients WHERE recipe_id = ?",
        [recipe.id || recipeId]
      );

      const ingredients = recipe.ingredients || [];

      for (const ingredient of ingredients) {
        const cleanIngredient = String(ingredient).trim().toLowerCase();

        if (!cleanIngredient) continue;

        const [ingredientResult] = await connection.execute(
          `
          INSERT INTO ingredients (ingredient_name)
          VALUES (?)
          ON DUPLICATE KEY UPDATE
            ingredient_id = LAST_INSERT_ID(ingredient_id)
          `,
          [cleanIngredient]
        );

        const ingredientId = ingredientResult.insertId;

        await connection.execute(
          `
          INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id)
          VALUES (?, ?)
          `,
          [recipe.id || recipeId, ingredientId]
        );
      }

      await connection.execute(
        "DELETE FROM recipe_steps WHERE recipe_id = ?",
        [recipe.id || recipeId]
      );

      const steps = recipe.steps || [];

      for (let i = 0; i < steps.length; i++) {
        await connection.execute(
          `
          INSERT INTO recipe_steps (recipe_id, step_number, instruction)
          VALUES (?, ?, ?)
          `,
          [recipe.id || recipeId, i + 1, steps[i]]
        );
      }
    }

    await connection.commit();

    console.log("Recipes imported successfully.");
    console.log("Total recipes:", Object.keys(recipes).length);
  } catch (error) {
    await connection.rollback();
    console.error("Failed to import recipes:", error.message);
  } finally {
    await connection.end();
  }
}

seedRecipes();