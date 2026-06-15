import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import SniperCursor from "@/components/SniperCursor";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syndicate — Autonomous Penetration Testing",
  description:
    "Syndicate is an autonomous penetration testing platform. It assesses your web applications the way an attacker would, confirms what's actually exploitable, and delivers findings your team can act on immediately.",
  metadataBase: new URL("https://syndicate.security"),
  openGraph: {
    title: "Syndicate — Autonomous Penetration Testing",
    description:
      "Continuous, expert-grade security assessment. Find the weaknesses before someone else does.",
    type: "website",
  },
};

// Set theme before paint to avoid a flash of the wrong mode.
const themeScript = `
(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <Ticker />
        <SniperCursor />
      </body>
    </html>
  );
}
