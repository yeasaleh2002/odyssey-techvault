"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionTitle, ProductCard, LoadingSpinner } from "@/components/shared";
import api from "@/lib/api";
import { Product } from "@/types";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?limit=4');
        setFeaturedProducts(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Featured Products"
          subtitle="Hand-picked selection of our most popular tech products"
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id || (product as any)._id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/items"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors group shadow-lg shadow-primary/20"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
