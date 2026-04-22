"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [selectedCategoryType, setSelectedCategoryType] = useState("");

  // Pre-defined categories with icons
  const categoryIcons = {
    "Mobiles": "📱",
    "Electronics": "💻",
    "Vehicles": "🚗",
    "Property": "🏠",
    "Home & Living": "🛋️",
    "Pets & Animals": "🐕",
    "Men's Fashion & Grooming": "👔",
    "Hobbies, Sports & Kids": "⚽",
    "Women's Fashion & Beauty": "💄",
    "Business & Industry": "🏭",
    "Education": "📚",
    "Jobs": "💼",
    "Essentials": "🛒",
    "Services": "🔧",
    "Agriculture": "🌾",
    "Overseas Jobs": "✈️"
  };

  // All available icons for selection
  const availableIcons = [
    { icon: "📱", name: "Mobile" },
    { icon: "💻", name: "Electronics" },
    { icon: "🖥️", name: "Computer" },
    { icon: "📺", name: "TV" },
    { icon: "🎮", name: "Gaming" },
    { icon: "📷", name: "Camera" },
    { icon: "🎧", name: "Audio" },
    { icon: "⌚", name: "Watch" },
    { icon: "🚗", name: "Car" },
    { icon: "🏠", name: "Property" },
    { icon: "🛋️", name: "Furniture" },
    { icon: "👕", name: "Clothing" },
    { icon: "👗", name: "Fashion" },
    { icon: "👟", name: "Shoes" },
    { icon: "📚", name: "Books" },
    { icon: "🎓", name: "Education" },
    { icon: "💼", name: "Jobs" },
    { icon: "🍔", name: "Food" },
    { icon: "🏋️", name: "Sports" },
    { icon: "🎨", name: "Art" },
    { icon: "🐕", name: "Pets" },
    { icon: "🌱", name: "Plants" },
    { icon: "🔧", name: "Tools" },
    { icon: "🎁", name: "Gifts" },
    { icon: "⭐", name: "Featured" },
    { icon: "✈️", name: "Travel" },
    { icon: "🏭", name: "Industry" },
    { icon: "💄", name: "Beauty" },
    { icon: "⚽", name: "Sports" },
    { icon: "🛒", name: "Shopping" },
    { icon: "🌾", name: "Agriculture" },
    { icon: "👔", name: "Men's Fashion" },
    { icon: "💅", name: "Women's Fashion" },
    { icon: "🐱", name: "Cats" },
    { icon: "🐶", name: "Dogs" },
    { icon: "🚲", name: "Bicycle" },
    { icon: "🏍️", name: "Motorcycle" },
    { icon: "🚚", name: "Truck" },
    { icon: "🏢", name: "Office" },
    { icon: "📞", name: "Phone" },
    { icon: "🖨️", name: "Printer" },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    
    // Auto-generate slug from name
    if (e.target.name === "name") {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  // Handle quick category selection
  const handleQuickCategorySelect = (categoryName) => {
    const icon = categoryIcons[categoryName];
    const slug = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    setForm({
      name: categoryName,
      slug: slug,
      description: "",
      icon: icon,
    });
    setSelectedCategoryType(categoryName);
    setMsg({ type: "success", text: `✅ "${categoryName}" category selected!` });
    setTimeout(() => setMsg({ type: "", text: "" }), 2000);
  };

  const handleIconSelect = (icon) => {
    setForm(prev => ({ ...prev, icon: icon }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/category/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setMsg({ type: "success", text: "✅ " + data.msg });
        setForm({ name: "", slug: "", description: "", icon: "" });
        setSelectedCategoryType("");
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setMsg({ type: "error", text: "❌ " + (data.msg || "Failed to create category") });
      }
    } catch (error) {
      console.error("Category creation error:", error);
      setMsg({ type: "error", text: "❌ Something went wrong. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Category</h1>
          <p className="mt-2 text-gray-600">Create a new product category</p>
        </div>

        {/* Quick Category Selection */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Quick Select from Common Categories:</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {Object.keys(categoryIcons).map((catName) => (
              <button
                key={catName}
                onClick={() => handleQuickCategorySelect(catName)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategoryType === catName
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                }`}
              >
                <span className="text-lg">{categoryIcons[catName]}</span>
                <span>{catName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Form */}
        <div className="p-6 bg-white rounded-lg shadow-xl md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Electronics, Furniture, Cars"
                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Slug will be auto-generated from name</p>
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block mb-1 text-sm font-medium text-gray-700">
                Slug <span className="text-xs text-gray-400">(Auto-generated)</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="auto-generated-slug"
                className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-50"
                readOnly
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category Icon <span className="text-xs text-gray-400">(Select an emoji)</span>
              </label>
              
              {/* Current Icon Preview */}
              {form.icon && (
                <div className="flex items-center justify-between p-3 mb-3 rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{form.icon}</span>
                    <span className="text-sm text-gray-600">Selected Icon</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, icon: "" }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Icon Grid */}
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="mb-3 text-xs text-gray-500">Click on an icon to select:</p>
                <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12">
                  {availableIcons.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => handleIconSelect(item.icon)}
                      className={`p-2 text-2xl hover:bg-gray-200 rounded-lg transition-colors ${
                        form.icon === item.icon ? "bg-blue-100 ring-2 ring-blue-500" : ""
                      }`}
                      title={item.name}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Icon Input */}
              <div className="mt-3">
                <label className="block mb-1 text-xs text-gray-500">Or enter custom emoji:</label>
                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="📱 (paste any emoji)"
                  className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="2"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                Description <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe what products belong in this category..."
                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message Display */}
            {msg.text && (
              <div
                className={`p-3 rounded-lg ${
                  msg.type === "success"
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
              >
                {msg.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Category...</span>
                </div>
              ) : (
                "Create Category"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="mb-2 text-sm font-semibold text-blue-800">💡 Tips:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Click on "Quick Select" buttons to automatically fill common categories</li>
              <li>• Category name should be unique and descriptive</li>
              <li>• Slug is automatically generated from the name</li>
              <li>• Click on any emoji icon to select it for your category</li>
              <li>• Description helps users understand the category</li>
            </ul>
          </div>
        </div>

        {/* Back to Categories Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-1 text-blue-600 transition-colors hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}