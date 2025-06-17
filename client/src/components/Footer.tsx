import { Bot } from "lucide-react";
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <span className="text-xl font-bold">AgenticRecipe.io</span>
            </div>
            <p className="text-slate-300 mb-4">
              Discover and deploy AI-powered agentic workflows that automate your daily tasks. 
              From productivity to development tools, find the perfect recipe for your needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaDiscord className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Recipes</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Productivity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sales Automation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Content Creation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Code Generation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Submit Recipe</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 AgenticRecipe.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
