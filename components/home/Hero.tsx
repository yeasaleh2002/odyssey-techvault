"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/20,transparent)]" />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 glass text-primary text-sm font-medium rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                New arrivals dropping weekly
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight text-balance tracking-tight"
            >
              Your Gateway to{" "}
              <span className="text-gradient">Premium Tech</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 text-pretty"
            >
              Discover cutting-edge gadgets, laptops, audio gear, and accessories. 
              Curated for tech enthusiasts who demand the absolute best in design and performance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/items"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/25 transition-all group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-foreground font-semibold rounded-xl hover:bg-muted/50 transition-all"
              >
                View Deals
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                <div className="p-2 glass rounded-lg">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                <div className="p-2 glass rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">2-Year Warranty</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-muted-foreground">
                <div className="p-2 glass rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Elements */}
          <div className="flex-1 hidden lg:block relative h-[600px] w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
            />
            
            <motion.div
              className="absolute top-10 right-10 w-64 h-80 glass-card rounded-2xl overflow-hidden animate-float"
              style={{ animationDelay: '0s' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60" 
                alt="Premium Phone"
                className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-10 w-72 h-48 glass-card rounded-2xl overflow-hidden animate-float z-20"
              style={{ animationDelay: '1.5s' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60" 
                alt="Premium Audio"
                className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 glass-card rounded-2xl overflow-hidden animate-float z-10"
              style={{ animationDelay: '3s' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60" 
                alt="Premium Accessories"
                className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
