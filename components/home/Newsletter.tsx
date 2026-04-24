"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate subscription
    setIsSubmitted(true);
    toast.success("Successfully subscribed to newsletter!");
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Stay Updated with Latest Tech
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Subscribe to our newsletter and get exclusive deals, new arrivals, and tech news delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitted}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors group"
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            No spam, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
