"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, AtSign, User, Tag } from "lucide-react";
import { SectionTitle } from "@/components/shared";
import api from "@/lib/api";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@techvault.com",
    href: "mailto:support@techvault.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+1 (555) 000-0000",
    href: "tel:+15550000000",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Silicon Valley, CA 94025",
    href: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon-Fri: 9AM - 6PM EST",
    href: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/contact", formData);
      if (response.data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Get in Touch"
          subtitle="Have a question or feedback? We'd love to hear from you."
        />

        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto mt-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all group shadow-sm">
                  <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-inherit" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quick Answers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 bg-primary text-primary-foreground rounded-3xl shadow-xl shadow-primary/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 opacity-80" />
                <h3 className="text-xl font-bold">Need Help?</h3>
              </div>
              <p className="opacity-80 mb-6">
                Our support team is available to help you with any technical issues or order inquiries.
              </p>
              <button className="w-full py-4 bg-background text-foreground font-bold rounded-2xl hover:bg-muted transition-colors">
                Start Live Chat
              </button>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-12 bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-sm font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm font-bold flex items-center gap-2">
                    <AtSign className="w-4 h-4 text-primary" /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="subject" className="text-sm font-bold flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="order">Order Issue</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-muted border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/25"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
