"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "react-toastify";

interface Recipe {
  recipe_id: number;
  title: string;
  created_at: string;
  author: {
    firstname: string;
    lastname: string;
  };
}

export default function RecipesAdminPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecipes(data);
      } else {
        setRecipes([]);
        if (data.error) toast.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Recipe deleted");
        fetchRecipes();
      } else {
        toast.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Recipe Blog Management</h1>
        <Link
          href="/admin/recipes/new"
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add New Recipe
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No recipes found. Start by creating one!</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 border-b">Title</th>
                <th className="px-6 py-4 border-b">Author</th>
                <th className="px-6 py-4 border-b">Created At</th>
                <th className="px-6 py-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recipes.map((recipe) => (
                <tr key={recipe.recipe_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{recipe.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {recipe.author.firstname} {recipe.author.lastname}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(recipe.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/recipes/${recipe.recipe_id}`}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe.recipe_id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
