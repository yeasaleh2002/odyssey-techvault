"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Plus,
  Settings,
  ChevronDown,
  Cpu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { NavLink } from "@/types";

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:bg-primary/90 transition-colors">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Odyssey <span className="text-primary">TechVault</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/items/add"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Product
                        </Link>
                        <Link
                          href="/items/manage"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Manage Products
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-border">
                  {user ? (
                    <>
                      <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-medium text-foreground">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/items/add"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </Link>
                      <Link
                        href="/items/manage"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl hover:bg-muted transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Manage Products
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-center text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-center bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
}
