"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center" : ""} ${className}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full ${
          centered ? "mx-auto" : ""
        }`}
      />
    </motion.div>
  );
}
