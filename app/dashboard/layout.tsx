"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  Heart,
  Shield,
  Plus,
} from "lucide-react";
import { LoadingSpinner } from "@/components/shared";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user) {
      if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
        router.push("/dashboard/user");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const adminLinks = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/admins", label: "Manage Admins", icon: Shield },
    { href: "/items/add", label: "Add Product", icon: Plus },
    { href: "/items/manage", label: "Manage Products", icon: Package },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  const userLinks = [
    { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/user/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/dashboard/user/profile", label: "Profile", icon: UserIcon },
    { href: "/dashboard/user/settings", label: "Settings", icon: Settings },
  ];

  const links = user.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border md:min-h-screen flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground">
            {user.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
          </h2>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
