import { users, recipes, surveys, type User, type InsertUser, type Recipe, type InsertRecipe, type Survey, type InsertSurvey } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Recipe operations
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe | undefined>;
  getRecipesByCategory(category: string): Promise<Recipe[]>;
  getRecipesByTags(tags: string[]): Promise<Recipe[]>;
  searchRecipes(query: string): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  
  // Survey operations
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  getRecommendedRecipes(survey: InsertSurvey): Promise<Recipe[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private surveys: Map<number, Survey>;
  private currentUserId: number;
  private currentRecipeId: number;
  private currentSurveyId: number;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.surveys = new Map();
    this.currentUserId = 1;
    this.currentRecipeId = 1;
    this.currentSurveyId = 1;
    
    // Initialize with sample recipes
    this.initializeSampleRecipes();
  }

  private initializeSampleRecipes() {
    const sampleRecipes: InsertRecipe[] = [
      {
        title: "AI Task Scheduler",
        description: "Automatically prioritize and schedule tasks using GPT-4 and calendar integration. Perfect for busy professionals who want AI-powered time management.",
        tags: ["personal-productivity", "gpt-4", "calendar"],
        github_url: "https://github.com/example/ai-task-scheduler",
        demo_link: "https://demo.example.com/task-scheduler",
        prerequisites: ["OpenAI API Key", "Google Calendar API"],
        toolstack: ["GPT-4", "Google Calendar API", "Python"],
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 48,
        downloads: 1200,
        difficulty: "Beginner",
        category: "Productivity",
        featured: true,
      },
      {
        title: "Smart Lead Qualifier",
        description: "AI-powered lead scoring and qualification system that integrates with your CRM. Automatically scores prospects and triggers personalized follow-up sequences.",
        tags: ["sales-automation", "crm-integration", "langchain"],
        github_url: "https://github.com/example/smart-lead-qualifier",
        demo_link: "https://demo.example.com/lead-qualifier",
        prerequisites: ["CRM API Access", "OpenAI API Key"],
        toolstack: ["LangChain", "CRM APIs", "OpenAI"],
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 49,
        downloads: 890,
        difficulty: "Intermediate",
        category: "Sales",
        featured: true,
      },
      {
        title: "Code Review Assistant",
        description: "Automated code review agent that provides feedback on pull requests, suggests improvements, and checks for best practices using GPT-4.",
        tags: ["code-generation", "github-api", "gpt-4"],
        github_url: "https://github.com/example/code-review-assistant",
        demo_link: "https://demo.example.com/code-review",
        prerequisites: ["GitHub API Token", "OpenAI API Key"],
        toolstack: ["GPT-4", "GitHub API", "Node.js"],
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 47,
        downloads: 2100,
        difficulty: "Advanced",
        category: "Development",
        featured: true,
      },
      {
        title: "Content Calendar AI",
        description: "Generate and schedule social media content across platforms. AI creates engaging posts, optimal timing, and hashtag suggestions.",
        tags: ["content-creation", "social-media", "zapier"],
        github_url: "https://github.com/example/content-calendar-ai",
        demo_link: "https://demo.example.com/content-calendar",
        prerequisites: ["Social Media API Keys", "OpenAI API Key"],
        toolstack: ["OpenAI", "Zapier", "Social APIs"],
        thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 46,
        downloads: 756,
        difficulty: "Beginner",
        category: "Content",
        featured: false,
      },
      {
        title: "Data Analysis Agent",
        description: "Automated data analysis and insight generation from CSV files. Creates visualizations and provides natural language explanations.",
        tags: ["data-analysis", "python", "pandas"],
        github_url: "https://github.com/example/data-analysis-agent",
        demo_link: "https://demo.example.com/data-analysis",
        prerequisites: ["Python Environment", "Pandas", "Matplotlib"],
        toolstack: ["Python", "Pandas", "GPT-4", "Matplotlib"],
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 48,
        downloads: 1500,
        difficulty: "Intermediate",
        category: "Analytics",
        featured: false,
      },
      {
        title: "Customer Support Bot",
        description: "Intelligent customer support agent that handles common queries, escalates complex issues, and integrates with your help desk system.",
        tags: ["customer-support", "chatbot", "nlp"],
        github_url: "https://github.com/example/customer-support-bot",
        demo_link: "https://demo.example.com/support-bot",
        prerequisites: ["Help Desk API", "OpenAI API Key"],
        toolstack: ["OpenAI", "LangChain", "Help Desk APIs"],
        thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        rating: 45,
        downloads: 643,
        difficulty: "Intermediate",
        category: "Support",
        featured: false,
      },
    ];

    sampleRecipes.forEach(recipe => {
      const id = this.currentRecipeId++;
      this.recipes.set(id, { ...recipe, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipeById(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(
      recipe => recipe.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getRecipesByTags(tags: string[]): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(recipe =>
      tags.some(tag => recipe.tags.some(recipeTag => 
        recipeTag.toLowerCase().includes(tag.toLowerCase())
      ))
    );
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(recipe =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      recipe.toolstack.some(tool => tool.toLowerCase().includes(lowerQuery))
    );
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentRecipeId++;
    const recipe: Recipe = { ...insertRecipe, id };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const id = this.currentSurveyId++;
    const survey: Survey = { 
      ...insertSurvey, 
      id, 
      created_at: new Date().toISOString() 
    };
    this.surveys.set(id, survey);
    return survey;
  }

  async getRecommendedRecipes(survey: InsertSurvey): Promise<Recipe[]> {
    const allRecipes = Array.from(this.recipes.values());
    
    // Score recipes based on survey responses
    const scoredRecipes = allRecipes.map(recipe => {
      let score = 0;
      
      // Match automation goals with recipe tags and category
      survey.automation_goals.forEach(goal => {
        if (recipe.tags.some(tag => tag.toLowerCase().includes(goal.toLowerCase())) ||
            recipe.category.toLowerCase().includes(goal.toLowerCase())) {
          score += 3;
        }
      });
      
      // Match tools used with recipe toolstack
      survey.tools_used.forEach(tool => {
        if (recipe.toolstack.some(recipeTool => 
          recipeTool.toLowerCase().includes(tool.toLowerCase()))) {
          score += 2;
        }
      });
      
      // Match experience level with difficulty
      if (recipe.difficulty.toLowerCase() === survey.experience_level.toLowerCase()) {
        score += 1;
      }
      
      // Boost featured recipes
      if (recipe.featured) {
        score += 1;
      }
      
      return { recipe, score };
    });
    
    // Sort by score and return top recipes
    return scoredRecipes
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => item.recipe);
  }
}

export const storage = new MemStorage();
