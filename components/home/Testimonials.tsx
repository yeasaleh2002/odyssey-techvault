"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { SectionTitle } from "@/components/shared";
import { testimonials } from "@/data/products";

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="What Our Customers Say"
          subtitle="Join thousands of satisfied customers who trust Odyssey TechVault"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {`"${testimonial.content}"`}
              </p>

              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
