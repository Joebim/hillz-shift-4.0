import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/src/contexts/ToastContext";
import QueryProvider from "@/src/providers/QueryProvider";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

const font = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: {
    default: "The Hillz | The People of His Presence and Dominion",
    template: "%s | The Hillz"
  },
  description: "A global movement of people who seek the Lord and a dwelling place with the King on the Father's Holy Hill of Zion.",
  keywords: ["The Hillz", "Zion", "Christian Movement", "Prayer", "Spirituality", "Dominion"],
  authors: [{ name: "The Hillz" }],
  creator: "The Hillz",
  publisher: "The Hillz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hillz.org",
    siteName: "The Hillz",
    title: "The Hillz | The People of His Presence and Dominion",
    description: "A global movement of people who seek the Lord and a dwelling place with the King on the Father's Holy Hill of Zion.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Hillz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Hillz",
    description: "The People of His Presence and Dominion",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
