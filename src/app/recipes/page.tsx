"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, User, ChevronRight } from "lucide-react";

interface Recipe {
  recipe_id: number;
  title: string;
  image: string | null;
  created_at: string;
  author: {
    firstname: string;
    lastname: string;
  };
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Kitchen <span className="text-orange-600">Recipes</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover delicious recipes shared by our expert chefs and community members. 
            Standardize your kitchen with professional guides.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-gray-500 text-xl">No recipes shared yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link key={recipe.recipe_id} href={`/recipes/${recipe.recipe_id}`}>
                <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={recipe.image || "https://images.unsplash.com/photo-1495195129352-aed325a55b65?q=80&w=2076&auto=format&fit=crop"}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-orange-600 font-bold uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1">
                        <User size={14} /> {recipe.author.firstname}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {new Date(recipe.created_at).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {recipe.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                      Explore this amazing recipe and learn the secrets of {recipe.author.firstname}'s kitchen...
                    </p>
                    <div className="flex items-center text-orange-600 font-bold text-sm">
                      Read More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
