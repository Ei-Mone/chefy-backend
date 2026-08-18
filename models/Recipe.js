const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ["Daily Meals", "Kid Foods"]
    },

    ageGroup: {
      type: String,
      default: null
    },

    image: {
      type: String,
      default: ""
    },

    ingredients: {
      type: [String],
      default: []
    },

    steps: {
      type: [String],
      default: []
    },

    shortAdvantages: {
      type: String,
      default: ""
    },

    advantages: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;