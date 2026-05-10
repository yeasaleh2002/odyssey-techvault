"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, Percent, ShoppingCart, Heart, Star, Loader2 } from "lucide-react";
import { SectionTitle } from "@/components/shared";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function DealsPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const [dealProducts, setDealProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/products", { params: { deal: "true", limit: 6 } });
        if (res.data.success) setDealProducts(res.data.data);
      } catch {
        console.error("Failed to load deals");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // ── Identical pattern to items/page.tsx ──────────────────────────────────
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 p-8 md:p-12 bg-gradient-to-r from-primary via-primary/90 to-primary/70 rounded-3xl text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20px 20px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 rounded-full mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Limited Time Offers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Exclusive Deals &amp; Discounts</h1>
            <p className="text-lg text-primary-foreground/80">
              Don&apos;t miss out on our best prices. These deals won&apos;t last forever!
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Percent, color: "text-primary bg-primary/10", title: "Up to 30%", sub: "Savings on select items" },
            { icon: Clock, color: "text-destructive bg-destructive/10", title: "72 Hours", sub: "Flash sale duration" },
            { icon: Zap, color: "text-green-500 bg-green-500/10", title: `${dealProducts.length}+`, sub: "Active deals" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl"
            >
              <div className={`p-3 rounded-xl ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <SectionTitle title="Current Deals" subtitle="Grab these amazing offers before they expire" />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : dealProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No active deals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealProducts.map((product, index) => {
              const pid = product._id;
              const inWishlist = isInWishlist(pid);
              const isAdding = addingToCart === pid;
              const discountPct = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;

              return (
                <motion.div
                  key={pid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  // ✅ Card wrapper is a div — NOT a Link — so buttons inside don't conflict
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  {/* Image — only this section navigates to product detail */}
                  <Link href={`/items/${pid}`} className="relative h-52 bg-muted overflow-hidden block">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => { e.target.src = "https://placehold.co/400x208/1a1a2e/ffffff?text=Deal"; }}
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">🔥 DEAL</span>
                      {!product.inStock && (
                        <span className="bg-gray-700 text-white text-xs px-2.5 py-1 rounded-full">Out of Stock</span>
                      )}
                    </div>
                    {discountPct && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discountPct}%
                      </div>
                    )}

                    {/* ✅ Wishlist button — stopPropagation prevents Link navigation */}
                    <button
                      onClick={(e) => handleWishlist(e, product)}
                      className={`absolute bottom-3 right-3 p-2 rounded-full transition-all shadow-sm ${
                        inWishlist
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
                      }`}
                      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
                    </button>
                  </Link>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Title links to product */}
                    <Link href={`/items/${pid}`}>
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">
                      {product.shortDescription}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= Math.round(product.rating)
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
                      <span className="text-xl font-bold text-primary">${product.price?.toFixed(2)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* ✅ Add to Cart button — standalone, no parent Link */}
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
                        <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                      ) : !product.inStock ? (
                        "Out of Stock"
                      ) : (
                        <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
