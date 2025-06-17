import { Button } from "@/components/ui/button";
import { Menu, Bot } from "lucide-react";

interface HeaderProps {
  onOpenSurvey: () => void;
}

export default function Header({ onOpenSurvey }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold text-slate-800">AgenticRecipe.io</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Discover</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Submit Recipe</a>
            <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Documentation</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button onClick={onOpenSurvey} className="bg-primary text-white hover:bg-blue-700">
              Get Started
            </Button>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
