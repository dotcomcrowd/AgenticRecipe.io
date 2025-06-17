import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeCard from "./RecipeCard";
import { Grid, List } from "lucide-react";
import type { Recipe } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface RecipeGridProps {
  filters: {
    search: string;
    categories: string[];
    toolstack: string[];
    difficulty: string;
    tags: string[];
  };
}

export default function RecipeGrid({ filters }: RecipeGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!recipes.length) return;

    let filtered = [...recipes];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(recipe =>
        recipe.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Apply categories filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.categories.some(cat =>
          recipe.category.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Apply toolstack filter
    if (filters.toolstack.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.toolstack.some(tool =>
          recipe.toolstack.some(recipeTool =>
            recipeTool.toLowerCase().includes(tool.toLowerCase())
          )
        )
      );
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(recipe =>
        recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }

    // Sort recipes
    switch (sortBy) {
      case "popularity":
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "difficulty":
        const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]);
        break;
      default:
        break;
    }

    setFilteredRecipes(filtered);
  }, [recipes, filters, activeCategory, sortBy]);

  const categories = ["All", "Productivity", "Sales", "Development", "Content", "Analytics", "Support"];

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border animate-pulse">
              <div className="w-full h-48 bg-slate-200 rounded-t-xl"></div>
              <div className="p-6">
                <div className="h-6 bg-slate-200 rounded mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-slate-200 rounded"></div>
                  <div className="h-6 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Recommended Recipes</h2>
          <p className="text-slate-600">
            {filteredRecipes.length} recipes found based on your preferences
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Sort by Popularity</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
              <SelectItem value="difficulty">Sort by Difficulty</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-slate-300 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Recipe Cards Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No recipes found matching your criteria.</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredRecipes.length > 0 && (
        <div className="text-center mt-12">
          <Button variant="outline" className="px-8 py-3">
            Load More Recipes
          </Button>
        </div>
      )}
    </div>
  );
}
