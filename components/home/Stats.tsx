"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Users, Package, ShoppingCart, Globe } from "lucide-react";
import api from "@/lib/api";

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 2 });
    return animation.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export function Stats() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 1240, // Simulated since we don't have an orders endpoint
    countries: 12, // Simulated
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/products')
        ]);
        setStats(prev => ({
          ...prev,
          users: usersRes.data.count || 500, // Fallback if 0
          products: productsRes.data.total || 150,
        }));
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: "Active Users", value: stats.users, icon: Users, suffix: "+" },
    { label: "Products", value: stats.products, icon: Package, suffix: "+" },
    { label: "Orders Delivered", value: stats.orders, icon: ShoppingCart, suffix: "+" },
    { label: "Countries Served", value: stats.countries, icon: Globe, suffix: "" },
  ];

  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="p-4 bg-muted rounded-2xl mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-4xl md:text-5xl font-bold text-foreground mb-2 flex items-center">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </h4>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
