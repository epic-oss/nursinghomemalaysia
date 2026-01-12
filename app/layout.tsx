import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthHeader } from "@/components/AuthHeader";
import { Footer } from "@/components/Footer";
import { OrganizationSchema } from "@/components/JsonLd";
import { GetQuoteButton } from "@/components/GetQuoteButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nursing Home Malaysia | Elderly Care Directory",
  description: "Discover the best nursing homes and elderly care facilities across Malaysia. Quality care and compassionate services for your loved ones.",
  verification: {
    google: "CsrwzTlHjaQ9_SVJaAvNnfu-c7FsGQ0knJPT",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RLYGVRTD5G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RLYGVRTD5G');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OrganizationSchema />
        <div className="flex min-h-screen flex-col">
          <AuthHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <GetQuoteButton />
      </body>
    </html>
  );
}
