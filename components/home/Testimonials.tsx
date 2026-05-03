"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/shared";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Software Engineer",
    content: "The quality of the mechanical keyboard I bought is outstanding. The shipping was incredibly fast, and the customer service was extremely helpful.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60"
  },
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    content: "I absolutely love the new monitor! The colors are incredibly accurate out of the box. Odyssey TechVault is my new go-to for tech gear.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
  },
  {
    name: "Michael Rodriguez",
    role: "Gamer",
    content: "Snagged a top-tier gaming headset during their weekend sale. The whole checkout process was smooth, and the package arrived in perfect condition.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="What Our Customers Say"
          subtitle="Real reviews from tech enthusiasts who trust Odyssey TechVault"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover bg-muted"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
