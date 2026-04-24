"use client";

import { motion } from "framer-motion";
import { Heart, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard, SectionTitle } from "@/components/shared";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {items.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <SectionTitle
                title="Your Wishlist"
                subtitle={`You have ${items.length} item${items.length === 1 ? "" : "s"} saved`}
              />
              <button
                onClick={clearWishlist}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors mb-2"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="inline-flex p-6 bg-muted rounded-full mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Save items you love so you can easily find them later. Browse our collection to get started.
            </p>
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5" />
              Browse Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
