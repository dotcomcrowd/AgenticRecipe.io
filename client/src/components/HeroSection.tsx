import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";

interface HeroSectionProps {
  onOpenSurvey: () => void;
}

export default function HeroSection({ onOpenSurvey }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Discover AI-Powered 
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {" "}Agentic Workflows
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Find, customize, and deploy AI agent templates that automate your workflows. 
          From productivity to development tools, discover recipes that match your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onOpenSurvey}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Take Survey & Get Recommendations
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-400 hover:border-white text-white hover:text-white px-8 py-3 text-base font-semibold bg-transparent"
          >
            <Search className="mr-2 h-5 w-5" />
            Browse All Recipes
          </Button>
        </div>
      </div>
    </section>
  );
}
