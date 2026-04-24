"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { sampleProducts } from "@/data/products";
import { SectionTitle, ProductCard } from "@/components/shared";

export function DealsSection() {
  const dealProducts = sampleProducts.filter((p) => p.deal).slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Hot Deals"
          subtitle="Limited time offers on premium tech products"
        />

        {/* Banner */}
        <div className="mb-12 p-6 md:p-8 bg-gradient-to-r from-primary to-primary/70 rounded-2xl text-primary-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/20 rounded-xl">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Flash Sale</h3>
                <p className="text-primary-foreground/80">Up to 50% off on select items</p>
              </div>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary font-semibold rounded-xl hover:bg-primary-foreground/90 transition-colors group"
            >
              View All Deals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
