import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertSurvey } from "@shared/schema";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurveyModal({ isOpen, onClose }: SurveyModalProps) {
  const [automationGoals, setAutomationGoals] = useState<string[]>([]);
  const [toolsUsed, setToolsUsed] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitSurveyMutation = useMutation({
    mutationFn: async (surveyData: InsertSurvey) => {
      const response = await apiRequest("POST", "/api/survey", surveyData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Survey Submitted!",
        description: `Found ${data.recommendations.length} personalized recommendations for you.`,
      });
      queryClient.setQueryData(["/api/recipes"], data.recommendations);
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setAutomationGoals([]);
    setToolsUsed([]);
    setExperienceLevel("");
  };

  const handleAutomationGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setAutomationGoals([...automationGoals, goal]);
    } else {
      setAutomationGoals(automationGoals.filter(g => g !== goal));
    }
  };

  const handleToolChange = (tool: string, checked: boolean) => {
    if (checked) {
      setToolsUsed([...toolsUsed, tool]);
    } else {
      setToolsUsed(toolsUsed.filter(t => t !== tool));
    }
  };

  const handleSubmit = () => {
    if (automationGoals.length === 0 || toolsUsed.length === 0 || !experienceLevel) {
      toast({
        title: "Please complete all sections",
        description: "Fill out all survey questions to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    const surveyData: InsertSurvey = {
      automation_goals: automationGoals,
      tools_used: toolsUsed,
      experience_level: experienceLevel,
    };

    submitSurveyMutation.mutate(surveyData);
  };

  const automationOptions = [
    {
      value: "content-creation",
      title: "Content Creation",
      description: "Blog posts, social media, marketing"
    },
    {
      value: "sales-automation",
      title: "Sales & CRM",
      description: "Lead qualification, follow-ups"
    },
    {
      value: "code-generation",
      title: "Code & Development",
      description: "Code review, documentation"
    },
    {
      value: "personal-productivity",
      title: "Productivity",
      description: "Task management, scheduling"
    }
  ];

  const toolOptions = [
    "Slack", "Notion", "Zapier", "GitHub", "HubSpot", "Google Workspace"
  ];

  const experienceOptions = [
    {
      value: "Beginner",
      title: "Beginner",
      description: "I prefer no-code solutions and simple setups"
    },
    {
      value: "Intermediate",
      title: "Intermediate", 
      description: "I can handle some configuration and setup"
    },
    {
      value: "Advanced",
      title: "Advanced",
      description: "I'm comfortable with code and complex integrations"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center justify-between">
            Find Your Perfect Recipe
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Question 1 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">What do you want to automate?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {automationOptions.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <Checkbox
                    checked={automationGoals.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleAutomationGoalChange(option.value, checked as boolean)
                    }
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium text-slate-800">{option.title}</div>
                    <div className="text-sm text-slate-500">{option.description}</div>
                  </div>
                </Label>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Which tools do you currently use?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {toolOptions.map((tool) => (
                <Label
                  key={tool}
                  className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <Checkbox
                    checked={toolsUsed.includes(tool)}
                    onCheckedChange={(checked) => 
                      handleToolChange(tool, checked as boolean)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-slate-700">{tool}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">What's your technical experience?</h3>
            <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
              <div className="space-y-3">
                {experienceOptions.map((option) => (
                  <Label
                    key={option.value}
                    className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <RadioGroupItem value={option.value} className="mr-3" />
                    <div>
                      <div className="font-medium text-slate-800">{option.title}</div>
                      <div className="text-sm text-slate-500">{option.description}</div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-slate-200">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitSurveyMutation.isPending}
            className="bg-primary text-white hover:bg-blue-700"
          >
            {submitSurveyMutation.isPending ? (
              "Processing..."
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get My Recommendations
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
