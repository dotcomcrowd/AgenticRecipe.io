import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FilterSidebar from "@/components/FilterSidebar";
import RecipeGrid from "@/components/RecipeGrid";
import Footer from "@/components/Footer";
import SurveyModal from "@/components/SurveyModal";

export default function Home() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    toolstack: [] as string[],
    difficulty: "",
    tags: [] as string[],
  });

  const openSurvey = () => setIsSurveyOpen(true);
  const closeSurvey = () => setIsSurveyOpen(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onOpenSurvey={openSurvey} />
      <HeroSection onOpenSurvey={openSurvey} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          <RecipeGrid filters={filters} />
        </div>
      </main>

      <Footer />
      <SurveyModal isOpen={isSurveyOpen} onClose={closeSurvey} />
    </div>
  );
}
