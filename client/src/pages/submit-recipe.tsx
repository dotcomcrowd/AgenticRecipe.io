import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { insertRecipeSchema, type InsertRecipe } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus } from "lucide-react";
import { z } from "zod";

const categories = [
  "Productivity",
  "Data Analysis", 
  "Content Creation",
  "Web Development",
  "Marketing Automation",
  "Customer Support",
  "Research",
  "Communication",
  "Other"
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

// Use the base schema directly
const formSchema = insertRecipeSchema;

export default function SubmitRecipe() {
  const [tagInput, setTagInput] = useState("");
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [toolstackInput, setToolstackInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertRecipe>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      github_url: "",
      demo_link: "",
      prerequisites: [],
      toolstack: [],
      thumbnail: "",
      difficulty: "Beginner",
      category: "",
      featured: false
    }
  });

  const createRecipeMutation = useMutation({
    mutationFn: async (recipeData: InsertRecipe) => {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData)
      });
      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({
        title: "Recipe submitted successfully!",
        description: "Your recipe has been added to the collection."
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your recipe. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertRecipe) => {
    createRecipeMutation.mutate(data);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim()) {
      const currentPrereqs = form.getValues("prerequisites") || [];
      if (!currentPrereqs.includes(prerequisiteInput.trim())) {
        form.setValue("prerequisites", [...currentPrereqs, prerequisiteInput.trim()]);
        setPrerequisiteInput("");
      }
    }
  };

  const removePrerequisite = (prereqToRemove: string) => {
    const currentPrereqs = form.getValues("prerequisites") || [];
    form.setValue("prerequisites", currentPrereqs.filter(prereq => prereq !== prereqToRemove));
  };

  const addToolstack = () => {
    if (toolstackInput.trim()) {
      const currentTools = form.getValues("toolstack") || [];
      if (!currentTools.includes(toolstackInput.trim())) {
        form.setValue("toolstack", [...currentTools, toolstackInput.trim()]);
        setToolstackInput("");
      }
    }
  };

  const removeToolstack = (toolToRemove: string) => {
    const currentTools = form.getValues("toolstack") || [];
    form.setValue("toolstack", currentTools.filter(tool => tool !== toolToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Submit New Recipe</CardTitle>
            <p className="text-center text-gray-600">Share your AI workflow with the community</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipe Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter recipe title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your AI workflow recipe..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL *</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="demo_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo Link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://demo.example.com" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.png" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tags Section */}
                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("tags") || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisites Section */}
                <div>
                  <FormLabel>Prerequisites</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a prerequisite"
                      value={prerequisiteInput}
                      onChange={(e) => setPrerequisiteInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                    />
                    <Button type="button" onClick={addPrerequisite} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("prerequisites") || []).map((prereq) => (
                      <Badge key={prereq} variant="outline" className="flex items-center gap-1">
                        {prereq}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removePrerequisite(prereq)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Toolstack Section */}
                <div>
                  <FormLabel>Toolstack</FormLabel>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a tool"
                      value={toolstackInput}
                      onChange={(e) => setToolstackInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToolstack())}
                    />
                    <Button type="button" onClick={addToolstack} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.watch("toolstack") || []).map((tool) => (
                      <Badge key={tool} variant="default" className="flex items-center gap-1">
                        {tool}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeToolstack(tool)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button 
                    type="submit" 
                    className="px-8"
                    disabled={createRecipeMutation.isPending}
                  >
                    {createRecipeMutation.isPending ? "Submitting..." : "Submit Recipe"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}