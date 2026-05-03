import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Navbar, Footer, ThemeProvider } from "@/components/shared";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Odyssey TechVault | Premium Tech Products",
    template: "%s | Odyssey TechVault",
  },
  description:
    "Discover cutting-edge technology at Odyssey TechVault. Shop the latest laptops, phones, audio gear, and accessories with unbeatable deals.",
  keywords: [
    "tech",
    "electronics",
    "laptops",
    "phones",
    "audio",
    "gadgets",
    "accessories",
  ],

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    className:
                      "!bg-card !text-card-foreground !border !border-border !shadow-lg",
                    duration: 3000,
                  }}
                />
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
