import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/providers";
import { StorefrontLayout } from "@/components/layout/storefront";
import { SiteConfigLayout } from "@/components/site-config-layout";
import { DynamicFavicon } from "@/components/favicon";
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
  icons: {
    icon: "/favicon.ico", // This will be overridden by DynamicFavicon
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var stored = localStorage.getItem('site-config-storage');
                if (stored) {
                  try {
                    var data = JSON.parse(stored);
                    if (data.state && data.state.config && data.state.config.favicon) {
                      var link = document.querySelector('link[rel="icon"]');
                      if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                      }
                      link.href = data.state.config.favicon;
                      link.type = 'image/x-icon';
                    }
                  } catch(e) {}
                }
              })();
            `,
          }}
        />
      </head>
      <DynamicFavicon />
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProvider>
          <SiteConfigLayout>
            <StorefrontLayout>
              {children}
            </StorefrontLayout>
          </SiteConfigLayout>
        </AppProvider>
      </body>
    </html>
  );
}