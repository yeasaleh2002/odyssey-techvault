"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Target,
  Users,
  Award,
  Zap,
  Shield,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { SectionTitle } from "@/components/shared";

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We stay ahead of the curve, bringing you the latest and greatest in technology.",
  },
  {
    icon: Shield,
    title: "Quality",
    description:
      "Every product is carefully vetted to ensure it meets our high standards.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Quick and reliable shipping to get your tech to you as soon as possible.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description:
      "Your satisfaction is our priority. We&apos;re here to help every step of the way.",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Sold" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support" },
];

const team = [
  {
    name: "Yeasaleh",
    role: "Owner",
    image: "https://yeasaleh.xyz/static/media/yeasaleh.43c63c8a.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/15,transparent)]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Our Story
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Building the Future of Tech Retail
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Founded in 2020, Odyssey TechVault has grown from a small startup
              to a leading destination for tech enthusiasts worldwide. We
              believe everyone deserves access to cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-card border border-border rounded-2xl"
            >
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                To democratize access to premium technology by offering
                carefully curated products at competitive prices, backed by
                exceptional customer service and expert guidance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-card border border-border rounded-2xl"
            >
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground">
                To be the most trusted tech marketplace globally, known for
                innovation, quality, and an unwavering commitment to customer
                satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Our Values"
            subtitle="The principles that guide everything we do"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-card border border-border rounded-2xl text-center"
              >
                <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="Meet Our Team"
            subtitle="The passionate people behind Odyssey TechVault"
          />

          <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group text-center"
              >
                <div className="relative w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
