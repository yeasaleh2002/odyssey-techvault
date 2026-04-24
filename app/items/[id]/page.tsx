"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { getProducts } from "@/lib/storage";
import { useCart } from "@/context/CartContext";
import { ProductCard, LoadingSpinner } from "@/components/shared";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const products = getProducts();
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setRelatedProducts(
        products
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4)
      );
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!product) {
    notFound();
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/items">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/items" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/items?category=${product.category}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Badges */}
              {product.deal && (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1.5 bg-destructive text-destructive-foreground text-sm font-semibold rounded-full">
                  <Zap className="w-4 h-4" />
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((_, i) => (
                <button
                  key={i}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${
                    i === 0 ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category */}
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-4xl font-bold text-foreground">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.deal && (
                <span className="px-2 py-1 bg-destructive/10 text-destructive text-sm font-semibold rounded">
                  Save ${(product.originalPrice! - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mt-4">
              {product.inStock ? (
                <>
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-500 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 bg-destructive rounded-full" />
                  <span className="text-sm text-destructive font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Full Description */}
            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-4 border border-border rounded-xl hover:bg-muted transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 border border-border rounded-xl hover:bg-muted transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-2">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">2-Year Warranty</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-2">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">30-Day Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Specifications</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {product.specifications.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`flex justify-between p-4 ${
                    index % 2 === 0 ? "bg-muted/30" : ""
                  } ${index < product.specifications.length - 2 ? "border-b border-border" : ""}`}
                >
                  <span className="font-medium text-foreground">{spec.label}</span>
                  <span className="text-muted-foreground text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
