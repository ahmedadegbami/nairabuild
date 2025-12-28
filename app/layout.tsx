import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    template: "%s | Nairabuild",
    default: "Nairabuild | Solutions & Innovation Blog",
  },
  description:
    "A blog sharing solutions and innovation across construction, engineering, and technology.",
  openGraph: {
    title: "Nairabuild | Solutions & Innovation Blog",
    description:
      "A blog sharing solutions and innovation across construction, engineering, and technology.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/naira_build_logo.png`,
        width: 1200,
        height: 630,
        alt: "Nairabuild logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nairabuild | Solutions & Innovation Blog",
    description:
      "A blog sharing solutions and innovation across construction, engineering, and technology.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/naira_build_logo.png`],
  },
  icons: {
    icon: [
      { url: "/naira_build_logo.png", type: "image/png" },
      "/favicon.ico",
    ],
  },
  robots: !isProduction ? "noindex, nofollow" : "index, follow",
};

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/naira_build_logo.png?v=1" type="image/png" />
      <link rel="apple-touch-icon" href="/naira_build_logo.png?v=1" />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overscroll-none",
          fontSans.variable
        )}
      >
        <Script
          defer
          src="https://tracking-zeta-two.vercel.app/script.js"
          data-website-id="c8b3a517-4d85-49d2-b746-a2f81d2177d4"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
