import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Download, ExternalLink, Github } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  viewMode?: "grid" | "list";
}

export default function RecipeCard({ recipe, viewMode = "grid" }: RecipeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-400";
      case "intermediate":
        return "bg-yellow-400";
      case "advanced":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
      "bg-teal-100 text-teal-700",
    ];
    
    const hash = tag.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <img
              src={recipe.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"}
              alt={recipe.title}
              className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-800 hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              
              <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                {recipe.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={`text-xs ${getTagColor(tag)}`}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                    {((recipe.rating || 0) / 10).toFixed(1)}
                  </span>
                  <span className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {recipe.downloads || 0}
                  </span>
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getDifficultyColor(recipe.difficulty)}`}></div>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden group">
      <div className="relative">
        <img
          src={recipe.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {recipe.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`text-xs font-medium ${getTagColor(tag)}`}
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
              {((recipe.rating || 0) / 10).toFixed(1)}
            </span>
            <span className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              {recipe.downloads ? `${(recipe.downloads / 1000).toFixed(1)}k` : '0'}
            </span>
            <span className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${getDifficultyColor(recipe.difficulty)}`}></div>
              {recipe.difficulty}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button asChild className="flex-1 bg-primary text-white hover:bg-blue-700">
            <a href={recipe.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              View Code
            </a>
          </Button>
          {recipe.demo_link && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="px-4"
            >
              <a href={recipe.demo_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
