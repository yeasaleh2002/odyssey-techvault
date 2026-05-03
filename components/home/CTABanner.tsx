"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-background rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-background rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-background/20 px-4 py-2 rounded-full mb-8">
            <Zap className="w-5 h-5 text-primary-foreground" />
            <span className="text-primary-foreground font-medium">Limited Time Offer</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-8 tracking-tight">
            Get 20% Off Your First Order
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl mx-auto">
            Sign up today and unlock exclusive member benefits including early access to new products, 
            special discounts, and free shipping on all orders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-primary font-bold rounded-xl hover:bg-background/90 transition-all shadow-xl"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/items"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-background/30 text-primary-foreground font-bold rounded-xl hover:bg-background/10 transition-all"
            >
              Browse Products
            </Link>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-8 font-medium">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
