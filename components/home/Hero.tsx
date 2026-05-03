"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Premium Tech",
    subtitle: "Your Gateway to",
    description: "Discover cutting-edge gadgets, laptops, audio gear, and accessories. Curated for tech enthusiasts who demand the absolute best in design and performance.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Pro Audio",
    subtitle: "Immerse in",
    description: "Experience sound like never before. From studio monitors to noise-canceling headphones, elevate your auditory journey with top-tier brands.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    title: "Smart Accessories",
    subtitle: "Elevate with",
    description: "Connect your ecosystem with smart accessories designed to simplify your life. Style meets unparalleled functionality.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60"
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/20,transparent)]" />
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left z-10 min-h-[400px] flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-primary text-sm font-medium rounded-full mb-8">
                <Sparkles className="w-4 h-4" />
                New arrivals dropping weekly
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
                  {slides[current].subtitle}{" "}
                  <span className="text-primary">{slides[current].title}</span>
                </h1>
                <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  {slides[current].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/items"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/25 transition-all group"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-8 py-4 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-all"
              >
                View Deals
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground">
                <div className="p-2 bg-muted rounded-lg">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground">
                <div className="p-2 bg-muted rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">2-Year Warranty</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground">
                <div className="p-2 bg-muted rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Elements - Slider */}
          <div className="flex-1 relative h-[400px] lg:h-[600px] w-full max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]"
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full p-4"
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
                    <img 
                      src={slides[current].image} 
                      alt={slides[current].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    current === idx ? "bg-primary scale-125" : "bg-muted hover:bg-primary/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
