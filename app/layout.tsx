import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/src/contexts/ToastContext";
import { QueryProvider } from "@/src/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hillz Shift 4.0 | Spiritual Renewal & Transformation",
  description: "Join us for Hillz Shift 4.0. A life-changing experience. Register now and invite others.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              {children}
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
