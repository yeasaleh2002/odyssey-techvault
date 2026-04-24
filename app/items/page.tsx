"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/products";
import { getProducts } from "@/lib/storage";
import { Product } from "@/types";
import { ProductCard, SectionTitle, LoadingSpinner } from "@/components/shared";

function ItemsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query) ||
          p.fullDescription.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [selectedCategory, searchQuery, sortBy, products]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="All Products"
          subtitle="Browse our complete collection of premium tech products"
        />

        {/* Search and Filters Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden inline-flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="sticky top-24 p-6 bg-card border border-border rounded-2xl">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results count */}
            <p className="mb-6 text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
              {selectedCategory !== "All" && (
                <> in <span className="font-medium text-foreground">{selectedCategory}</span></>
              )}
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
      <ItemsContent />
    </Suspense>
  );
}
