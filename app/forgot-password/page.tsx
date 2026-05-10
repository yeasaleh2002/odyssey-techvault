"use client";

import Link from "next/link";
import { Cpu, Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-3 bg-primary rounded-xl group-hover:bg-primary/90 transition-colors">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Odyssey <span className="text-primary">TechVault</span>
            </span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="p-8 bg-card border border-border rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Reset Password</h1>
          <p className="text-muted-foreground text-center mb-8">
            Enter your email to receive reset instructions
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Password reset functionality is currently unavailable in the demo environment. Please contact support.")}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Send Reset Link
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
