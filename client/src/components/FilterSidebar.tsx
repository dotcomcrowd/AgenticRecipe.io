import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  filters: {
    search: string;
    categories: string[];
    toolstack: string[];
    difficulty: string;
    tags: string[];
  };
  onFiltersChange: (filters: any) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const categories = [
    { name: "Personal Productivity", count: 24 },
    { name: "Sales Automation", count: 18 },
    { name: "Code Generation", count: 31 },
    { name: "Content Creation", count: 27 },
  ];

  const toolstacks = [
    { name: "LangChain", count: 45 },
    { name: "OpenAI", count: 67 },
    { name: "Zapier", count: 23 },
  ];

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleToolstackChange = (tool: string, checked: boolean) => {
    const newToolstack = checked
      ? [...filters.toolstack, tool]
      : filters.toolstack.filter(t => t !== tool);
    onFiltersChange({ ...filters, toolstack: newToolstack });
  };

  const handleDifficultyChange = (difficulty: string) => {
    onFiltersChange({ ...filters, difficulty });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      toolstack: [],
      difficulty: "",
      tags: [],
    });
  };

  return (
    <aside className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-slate-500 hover:text-slate-700"
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-slate-700 mb-2">Search Recipes</Label>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by keyword..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-slate-700 mb-3">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.name}
                  checked={filters.categories.includes(category.name)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.name, checked as boolean)
                  }
                />
                <label
                  htmlFor={category.name}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
              <span className="text-xs text-slate-400">({category.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Stack */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-slate-700 mb-3">Tool Stack</Label>
        <div className="space-y-2">
          {toolstacks.map((tool) => (
            <div key={tool.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={tool.name}
                  checked={filters.toolstack.includes(tool.name)}
                  onCheckedChange={(checked) => 
                    handleToolstackChange(tool.name, checked as boolean)
                  }
                />
                <label
                  htmlFor={tool.name}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  {tool.name}
                </label>
              </div>
              <span className="text-xs text-slate-400">({tool.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-slate-700 mb-3">Difficulty Level</Label>
        <RadioGroup
          value={filters.difficulty}
          onValueChange={handleDifficultyChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Beginner" id="beginner" />
            <label htmlFor="beginner" className="text-sm text-slate-600 cursor-pointer">
              Beginner
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Intermediate" id="intermediate" />
            <label htmlFor="intermediate" className="text-sm text-slate-600 cursor-pointer">
              Intermediate
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Advanced" id="advanced" />
            <label htmlFor="advanced" className="text-sm text-slate-600 cursor-pointer">
              Advanced
            </label>
          </div>
        </RadioGroup>
      </div>
    </aside>
  );
}
