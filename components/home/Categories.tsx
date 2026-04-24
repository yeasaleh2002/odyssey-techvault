"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Laptop, Smartphone, Headphones, Gamepad, Mouse } from "lucide-react";
import { SectionTitle } from "@/components/shared";

const categories = [
  { name: "Phones", icon: Smartphone, href: "/items?category=Phones", color: "from-blue-500 to-cyan-500" },
  { name: "Laptops", icon: Laptop, href: "/items?category=Laptops", color: "from-purple-500 to-pink-500" },
  { name: "Audio", icon: Headphones, href: "/items?category=Audio", color: "from-orange-500 to-red-500" },
  { name: "Gaming", icon: Gamepad, href: "/items?category=Gaming", color: "from-green-500 to-emerald-500" },
  { name: "Accessories", icon: Mouse, href: "/items?category=Accessories", color: "from-amber-500 to-yellow-500" },
];

export function Categories() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Shop by Category"
          subtitle="Find exactly what you need in our organized categories"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={category.href}
                className="group flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`p-5 bg-gradient-to-br ${category.color} rounded-2xl text-white group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <span className="text-base font-semibold text-foreground text-center">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
