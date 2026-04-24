"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sampleProducts } from "@/data/products";
import { SectionTitle, ProductCard } from "@/components/shared";

export function FeaturedProducts() {
  const featuredProducts = sampleProducts.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Featured Products"
          subtitle="Hand-picked selection of our most popular tech products"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/items"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
