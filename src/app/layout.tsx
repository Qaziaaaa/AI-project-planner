import type { Metadata } from "next";
import { Instrument_Serif, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BriefKit — AI Project Planner",
  description:
    "Turn rough app ideas into structured project briefs with AI. Features, tech stack, data model, routes, build phases, and more.",
  icons: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 36 36%22><rect width=%2236%22 height=%2236%22 rx=%228%22 fill=%22%23CC4A2A%22/><text y=%2232%22 font-size=%2228%22 text-anchor=%22middle%22 x=%2218%22>💼</text></svg>",
  appleWebApp: { title: "BriefKit" },
  other: { "theme-color": "#14100E" },
  openGraph: {
    title: "BriefKit — AI Project Planner",
    description:
      "Turn rough app ideas into structured project briefs with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${figtree.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
