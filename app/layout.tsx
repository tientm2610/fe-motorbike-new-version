import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/providers";
import { StorefrontLayout } from "@/components/layout/storefront";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Honda Dealership - Premium Motorcycle Ecommerce",
  description: "Discover premium Honda motorcycles with expert guidance, competitive pricing, and unparalleled service.",
  keywords: ["Honda motorcycle", "motorbike", "scooter", "Honda dealership", "Vietnam"],
  openGraph: {
    title: "Honda Dealership - Premium Motorcycle Ecommerce",
    description: "Discover premium Honda motorcycles with expert guidance, competitive pricing, and unparalleled service.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProvider>
          <StorefrontLayout>
            {children}
          </StorefrontLayout>
        </AppProvider>
      </body>
    </html>
  );
}