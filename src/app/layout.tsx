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
  icons: [
    { rel: "icon", url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23CC4A2A'/%3E%3Cg transform='translate(4,4)' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='20' height='14' x='2' y='6' rx='2'/%3E%3Cpath d='M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'/%3E%3C/g%3E%3C/svg%3E", type: "image/svg+xml" },
  ],
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
