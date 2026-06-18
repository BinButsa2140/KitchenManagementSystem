"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Save, X, Eye, Edit3 } from "lucide-react";
import { toast } from "react-toastify";

export default function NewRecipePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.warn("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, image }),
      });

      if (res.ok) {
        toast.success("Recipe published successfully!");
        router.push("/admin/recipes");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to publish recipe");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Edit3 className="text-orange-600" /> Create New Recipe
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            {preview ? <Edit3 size={18} /> : <Eye size={18} />}
            {preview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
          >
            <X size={18} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-md disabled:opacity-50"
          >
            <Save size={18} /> {isSubmitting ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Header Inputs */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Recipe Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a mouth-watering title..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-xl font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Image URL (Optional)</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="flex-1 flex overflow-hidden">
          {!preview ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your recipe steps here using Markdown...

Example:
## Ingredients
- 2 cups Flour
- 1 cup Sugar

## Instructions
1. Mix ingredients
2. Bake at 350F"
              className="flex-1 p-6 resize-none outline-none font-mono text-gray-700 leading-relaxed"
            />
          ) : (
            <div className="flex-1 p-8 overflow-y-auto prose prose-orange max-w-none">
              {image && (
                <img src={image} alt="Featured" className="w-full h-64 object-cover rounded-xl mb-8 shadow-md" />
              )}
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{title || "Recipe Title"}</h1>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "*No content yet. Use the editor to start writing!*"}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
