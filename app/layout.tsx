import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  title: "WINMYPORSCHE // TurboRide Supercar Club · Zero-Loss Supercar Giveaway",
  description:
    "Deposit ₹1,000 to receive 1,000 permanent TurboRide Drive Credits for track drives, plus a complimentary verified entry to win the Porsche 718 Cayman.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fafafa] text-[#09090b] selection:bg-[#ea580c] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
