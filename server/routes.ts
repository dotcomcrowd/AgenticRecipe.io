import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveySchema, insertRecipeSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const recipes = await storage.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Get recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recipe = await storage.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  // Search recipes
  app.get("/api/recipes/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      const recipes = await storage.searchRecipes(query);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to search recipes" });
    }
  });

  // Get recipes by category
  app.get("/api/recipes/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const recipes = await storage.getRecipesByCategory(category);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes by category" });
    }
  });

  // Filter recipes by tags
  app.post("/api/recipes/filter", async (req, res) => {
    try {
      const { tags, category, difficulty, toolstack, search } = req.body;
      let recipes = await storage.getAllRecipes();

      // Apply filters
      if (tags && tags.length > 0) {
        recipes = recipes.filter(recipe =>
          tags.some((tag: string) => recipe.tags.some(recipeTag => 
            recipeTag.toLowerCase().includes(tag.toLowerCase())
          ))
        );
      }

      if (category) {
        recipes = recipes.filter(recipe => 
          recipe.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (difficulty) {
        recipes = recipes.filter(recipe => 
          recipe.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
      }

      if (toolstack && toolstack.length > 0) {
        recipes = recipes.filter(recipe =>
          toolstack.some((tool: string) => recipe.toolstack.some(recipeTool => 
            recipeTool.toLowerCase().includes(tool.toLowerCase())
          ))
        );
      }

      if (search) {
        recipes = recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter recipes" });
    }
  });

  // Submit survey and get recommendations
  app.post("/api/survey", async (req, res) => {
    try {
      const surveyData = insertSurveySchema.parse(req.body);
      const survey = await storage.createSurvey(surveyData);
      const recommendations = await storage.getRecommendedRecipes(surveyData);
      
      res.json({
        survey,
        recommendations
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid survey data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process survey" });
    }
  });

  // Create new recipe
  app.post("/api/recipes", async (req, res) => {
    try {
      const recipeData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(recipeData);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
