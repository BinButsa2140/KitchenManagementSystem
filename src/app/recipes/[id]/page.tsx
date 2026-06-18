"use client";

import { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clock, User, ArrowLeft, Share2, Printer } from "lucide-react";
import Link from "next/link";

interface Recipe {
  recipe_id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
  author: {
    firstname: string;
    lastname: string;
  };
}

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Recipe not found");
        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
        <Link href="/recipes" className="text-orange-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1495195129352-aed325a55b65?q=80&w=2076&auto=format&fit=crop"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-7xl mx-auto">
          <Link href="/recipes" className="inline-flex items-center gap-2 text-orange-400 font-bold mb-6 hover:text-orange-300 transition-colors">
            <ArrowLeft size={20} /> Back to Blog
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            {recipe.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-xl font-bold">
                {recipe.author.firstname[0]}
              </div>
              <span>By {recipe.author.firstname} {recipe.author.lastname}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-orange-500" />
              <span>{new Date(recipe.created_at).toLocaleDateString("th-TH")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
          <div className="flex gap-4">
            <button className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors">
              <Share2 size={20} />
            </button>
            <button onClick={() => window.print()} className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors">
              <Printer size={20} />
            </button>
          </div>
          <div className="text-sm text-gray-400 italic">
            Standard Kitchen Protocol: V.1.0
          </div>
        </div>

        <div className="prose prose-orange lg:prose-xl max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {recipe.content}
          </ReactMarkdown>
        </div>
      </div>

      <style jsx global>{`
        .prose h2 { 
          border-left: 6px solid #f97316; 
          padding-left: 1.5rem; 
        }
        .prose blockquote { 
          background: #fff7ed; 
          border-radius: 0 1rem 1rem 0; 
        }
        .prose img { 
          border-radius: 2rem; 
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); 
        }
        
        @media print {
          .no-print { display: none; }
          body { background: white; }
        }
      `}</style>
    </article>
  );
}
