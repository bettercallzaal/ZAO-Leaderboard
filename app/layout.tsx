import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZAO Respect Leaderboard",
  description: "Community leaderboard tracking OG ZAO and ZOR Respect on Optimism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
