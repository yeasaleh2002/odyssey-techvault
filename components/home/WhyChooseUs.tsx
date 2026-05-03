"use client";

import { motion } from "framer-motion";
import { Shield, Truck, Headphones, RefreshCw, Award, CreditCard } from "lucide-react";
import { SectionTitle } from "@/components/shared";

const features = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Your data is protected with enterprise-grade security and SSL encryption.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free express shipping on orders over $50. Get your tech in 2-3 business days.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our expert team is always ready to help you with any questions or concerns.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns. Not satisfied? Get a full refund, no questions asked.",
  },
  {
    icon: Award,
    title: "Genuine Products",
    description: "100% authentic products sourced directly from manufacturers and authorized dealers.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options including credit cards, PayPal, and buy-now-pay-later.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Why Choose Us"
          subtitle="Experience the best in tech shopping with our premium services"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
