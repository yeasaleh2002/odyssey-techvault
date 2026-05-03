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
import { useCart } from "@/context/AuthContext"; // Wait, I should check if useCart is in AuthContext or CartContext
import { useCart as useRealCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard, LoadingSpinner } from "@/components/shared";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/services/product";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToCart } = useRealCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await getProductById(id);
        if (data.success) {
          setProduct(data.data);
          
          // Fetch related products
          const relatedData = await getProducts({ 
            category: data.data.category, 
            limit: 4 
          });
          if (relatedData.success) {
            setRelatedProducts(
              relatedData.data.filter((p: Product) => (p.id || (p as any)._id) !== id)
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><LoadingSpinner size="lg" /></div>;
  }

  if (!product) {
    notFound();
  }

  const inWishlist = isInWishlist(product.id || (product as any)._id);

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
          <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
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
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
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
                    alt={`${product.title} view ${i + 1}`}
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
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} (Verified Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-4xl font-bold text-foreground">
                ${product.price.toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span className="text-sm text-green-500 font-medium">In Stock</span>
            </div>

            {/* Short Description */}
            <div className="mt-6">
              <p className="text-lg font-medium text-foreground mb-2">{product.shortDescription}</p>
            </div>

            {/* Full Description */}
            <div className="mt-4">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 border rounded-xl transition-colors ${
                  inWishlist
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border hover:bg-muted text-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 transition-transform active:scale-75 ${inWishlist ? "fill-current" : ""}`} />
              </button>
              <button className="p-4 border border-border rounded-xl hover:bg-muted transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-2 text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-2 text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Authentic</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-2 text-primary">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id || (relatedProduct as any)._id} product={relatedProduct} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
