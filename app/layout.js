import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/propertyCard.css";
import "@/styles/homeaura.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "homeaurarealtor - Your Trusted Real Estate Partner",
  description: "Find your dream property with homeaurarealtor - Professional real estate services",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
