"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle } from "@/components/shared";

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. You can view specific costs at checkout before completing your purchase."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day hassle-free return policy. If you're not completely satisfied with your purchase, you can return it in its original condition and packaging for a full refund or exchange."
  },
  {
    question: "Are your products covered by warranty?",
    answer: "Absolutely. All our products come with a minimum 1-year manufacturer warranty. Many premium items include an extended 2-year warranty at no additional cost."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you will receive a confirmation email containing a tracking link. You can also view real-time tracking updates directly from your dashboard."
  },
  {
    question: "Do you offer financing or payment plans?",
    answer: "Yes! We partner with leading buy-now-pay-later services allowing you to split your purchase into 4 interest-free payments, available during checkout."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about shopping with us"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-4 md:p-8 shadow-sm"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base md:text-lg font-medium text-foreground hover:text-primary transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
