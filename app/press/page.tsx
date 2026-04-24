"use client";

import { SectionTitle } from "@/components/shared";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <SectionTitle
          title="Press"
          subtitle="Read the latest news and press releases about Odyssey TechVault."
        />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg leading-relaxed">
            This page is currently under construction. Please check back later for detailed information regarding our Press releases.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mt-4">
            If you have immediate questions, please don't hesitate to <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
