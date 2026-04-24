"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Zap } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.deal && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
            <Zap className="w-3 h-3" />
            {discount}% OFF
          </span>
        )}
        {product.featured && !product.deal && (
          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            Featured
          </span>
        )}
        {!product.inStock && (
          <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          inWishlist
            ? "bg-background text-destructive opacity-100 shadow-sm"
            : "bg-background/80 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 hover:bg-background hover:text-destructive"
        }`}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 transition-transform active:scale-75 ${inWishlist ? "fill-current" : ""}`} />
      </button>

      {/* Image */}
      <Link href={`/items/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <Link href={`/items/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
