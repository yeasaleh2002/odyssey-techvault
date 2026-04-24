"use client";

import { Zap, Clock, Percent } from "lucide-react";
import { sampleProducts } from "@/data/products";
import { ProductCard, SectionTitle } from "@/components/shared";
import { motion } from "framer-motion";

export default function DealsPage() {
  const dealProducts = sampleProducts.filter((p) => p.deal);

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
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 rounded-full mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Limited Time Offers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Exclusive Deals & Discounts
            </h1>
            <p className="text-lg text-primary-foreground/80 text-pretty">
              Don&apos;t miss out on our best prices. These deals won&apos;t last forever!
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl"
          >
            <div className="p-3 bg-primary/10 rounded-xl">
              <Percent className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Up to 50%</p>
              <p className="text-sm text-muted-foreground">Savings on select items</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl"
          >
            <div className="p-3 bg-destructive/10 rounded-xl">
              <Clock className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">72 Hours</p>
              <p className="text-sm text-muted-foreground">Flash sale duration</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl"
          >
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{dealProducts.length}+</p>
              <p className="text-sm text-muted-foreground">Active deals</p>
            </div>
          </motion.div>
        </div>

        <SectionTitle
          title="Current Deals"
          subtitle="Grab these amazing offers before they expire"
        />

        {dealProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No active deals at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
