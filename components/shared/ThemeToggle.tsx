"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-secondary/50 hover:bg-secondary border border-border hover:border-primary transition-all duration-300 group shadow-sm cursor-pointer z-[60]"
      aria-label="Toggle Theme"
      type="button"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500 fill-yellow-500/20 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-primary transition-transform duration-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
