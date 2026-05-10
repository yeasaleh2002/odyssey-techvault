"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  ShoppingCart, Heart, Star, ArrowUpDown, Filter, Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { LoadingSpinner } from "@/components/shared";
import { useRouter as useNav } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const CATEGORIES = ["All", "Phones", "Laptops", "Audio", "Gaming", "Accessories", "Other"];
const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-rating", label: "Highest Rated" },
  { value: "-reviews", label: "Most Reviewed" },
];

function ItemsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const categoryParam = searchParams.get("category") || "All";
  const keywordParam = searchParams.get("keyword") || "";
  const sortParam = searchParams.get("sort") || "-createdAt";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [searchQuery, setSearchQuery] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(pageParam);

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 9,
        sort: sortBy,
      };
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (searchQuery) params.keyword = searchQuery;

      const res = await api.get("/products", { params });
      const data = res.data;
      if (data.success) {
        setProducts(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, page, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateURL({ keyword: searchQuery, page: "1" });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    updateURL({ category: cat, page: "1" });
  };

  const handleSortChange = (sortVal: string) => {
    setSortBy(sortVal);
    setPage(1);
    updateURL({ sort: sortVal, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    setAddingToCart(product._id);
    await addToCart(product);
    setTimeout(() => setAddingToCart(null), 800);
  };

  const handleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleWishlist(product);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{products.length}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span> products
            {selectedCategory !== "All" && (
              <> in <span className="font-semibold text-primary">{selectedCategory}</span></>
            )}
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, category..."
              className="w-full pl-12 pr-10 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); updateURL({ keyword: "" }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex gap-2">
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className={`lg:w-56 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="p-5 bg-card border border-border rounded-2xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> Categories
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

              {/* Clear Filters */}
              {(selectedCategory !== "All" || searchQuery || sortBy !== "-createdAt") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSortBy("-createdAt");
                    setPage(1);
                    router.push("/items");
                  }}
                  className="w-full py-2.5 px-4 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-xl border border-red-200 transition-colors"
                >
                  <X className="w-4 h-4 inline mr-1.5" />
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-xl font-semibold text-foreground mb-2">No products found</p>
                <p className="text-muted-foreground mb-6">Try different keywords or clear the filters</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); router.push("/items"); }}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => {
                    const pid = product._id;
                    const inWishlist = isInWishlist(pid);
                    const isAdding = addingToCart === pid;
                    const discountPct = product.originalPrice
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : null;

                    return (
                      <Link
                        key={pid}
                        href={`/items/${pid}`}
                        className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative h-52 bg-muted overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e: any) => {
                              e.target.src = "https://placehold.co/400x208/1a1a2e/ffffff?text=Product";
                            }}
                          />
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                              {product.category}
                            </span>
                            {product.deal && (
                              <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                                DEAL
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="bg-gray-700 text-white text-xs px-2.5 py-1 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          {discountPct && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{discountPct}%
                            </div>
                          )}
                          {/* Wishlist button */}
                          <button
                            onClick={(e) => handleWishlist(e, product)}
                            className={`absolute bottom-3 right-3 p-2 rounded-full transition-all ${
                              inWishlist
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-sm"
                            }`}
                            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            {product.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                            {product.shortDescription}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= Math.round(product.rating)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {product.rating?.toFixed(1)} ({product.reviews?.toLocaleString()})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-xl font-bold text-primary">
                              ${product.price?.toFixed(2)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice?.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Add to Cart */}
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!product.inStock || isAdding}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              !product.inStock
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : isAdding
                                ? "bg-green-500 text-white"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            {isAdding ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                              </>
                            ) : !product.inStock ? (
                              "Out of Stock"
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" /> Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="p-2.5 bg-card border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {pageNumbers.map((num) => (
                      <button
                        key={num}
                        onClick={() => handlePageChange(num)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                          num === page
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border text-foreground hover:bg-muted"
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="p-2.5 bg-card border border-border rounded-xl text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
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
