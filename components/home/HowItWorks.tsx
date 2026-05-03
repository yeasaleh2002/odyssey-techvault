"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, CreditCard, Box } from "lucide-react";
import { SectionTitle } from "@/components/shared";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds to access exclusive deals and personalized recommendations."
  },
  {
    icon: Search,
    title: "Find Your Gear",
    description: "Browse our curated categories or use powerful search to find exactly what you need."
  },
  {
    icon: CreditCard,
    title: "Secure Checkout",
    description: "Pay safely with multiple payment options and enterprise-grade encryption."
  },
  {
    icon: Box,
    title: "Fast Delivery",
    description: "Track your order in real-time as it ships quickly directly to your doorstep."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="How It Works"
          subtitle="Your journey to better tech in four simple steps"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-border" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-md flex items-center justify-center mb-6 relative z-10">
                <step.icon className="w-10 h-10 text-primary" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm border-2 border-background">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-[250px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
