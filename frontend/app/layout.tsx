import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "Doctor AI — Intelligent care guidance",
  description:
    "Clear, compassionate health information from specialized AI doctors.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7fafd",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <Providers>
            <AppNav>{children}</AppNav>
          </Providers>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  );
}
