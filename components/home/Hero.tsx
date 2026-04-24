"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/15,transparent)]" />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              New arrivals dropping weekly
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance"
          >
            Your Gateway to{" "}
            <span className="text-primary">Premium Tech</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            Discover cutting-edge gadgets, laptops, audio gear, and accessories. 
            Curated for tech enthusiasts who demand the best.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/items"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors group"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
            >
              View Deals
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">2-Year Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
