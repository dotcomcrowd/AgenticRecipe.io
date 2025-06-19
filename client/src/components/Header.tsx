import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import logoImage from "@assets/Agentic Recipe - Logo1_1750355118310.png";

interface HeaderProps {
  onOpenSurvey: () => void;
}

export default function Header({ onOpenSurvey }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logoImage} 
                alt="Agentic Recipe" 
                className="h-16 w-auto"
              />
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-slate-600 hover:text-slate-900 font-medium">Discover</a>
            <a href="/submit-recipe" className="text-slate-600 hover:text-slate-900 font-medium">Submit Recipe</a>
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
