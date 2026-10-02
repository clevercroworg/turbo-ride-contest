import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://turbo-ride-contest.vercel.app"),
  title: {
    default: "WINMYPORSCHE // TurboRide Supercar Club · Zero-Loss Supercar Giveaway",
    template: "%s | TurboRide Supercar Club",
  },
  description:
    "Deposit ₹1,000 to receive 1,000 permanent TurboRide Drive Credits for track drives, plus a complimentary verified entry to win the Porsche 718 Cayman. 100% capital returned in drive credits.",
  applicationName: "TurboRide Supercar Club",
  keywords: [
    "TurboRide",
    "Win a Porsche",
    "Porsche 718 Cayman",
    "Supercar Giveaway India",
    "Buddh International Circuit",
    "Supercar Track Days",
    "Drive Credits",
    "Zero Loss Supercar Contest",
  ],
  authors: [{ name: "TurboRide Supercar Club" }],
  creator: "TurboRide",
  publisher: "TurboRide Supercar Club Pvt Ltd",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WINMYPORSCHE // TurboRide Supercar Club · Zero-Loss Supercar Giveaway",
    description:
      "Deposit ₹1,000 to receive 1,000 permanent TurboRide Drive Credits for track drives, plus a complimentary verified entry to win the Porsche 718 Cayman. 100% capital returned in drive credits.",
    url: "https://turbo-ride-contest.vercel.app",
    siteName: "TurboRide Supercar Club",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Win a Porsche 718 Cayman - TurboRide Supercar Club",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WINMYPORSCHE // TurboRide Supercar Club · Zero-Loss Supercar Giveaway",
    description:
      "Deposit ₹1,000 to receive 1,000 permanent TurboRide Drive Credits for track drives, plus a complimentary verified entry to win the Porsche 718 Cayman.",
    images: ["/og-image.png"],
    creator: "@turborideclub",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${inter.variable} ${oswald.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#fafafa] text-[#09090b] selection:bg-[#ea580c] selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
