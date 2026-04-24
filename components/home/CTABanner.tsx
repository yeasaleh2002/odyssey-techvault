"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
            Get 20% Off Your First Order
          </h2>

          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Sign up today and unlock exclusive member benefits including early access to new products, 
            special discounts, and free shipping on all orders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              <Link href="/register">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 font-semibold px-8"
            >
              <Link href="/items">Browse Products</Link>
            </Button>
          </div>

          <p className="text-white/60 text-sm mt-6">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
