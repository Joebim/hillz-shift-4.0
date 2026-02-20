import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/src/contexts/ToastContext";
import QueryProvider from "@/src/providers/QueryProvider";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

const font = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={font.className} suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <div className="flex min-h-screen flex-col">
              {children}
              <ConfirmModal />
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
