import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "ZAO Respect Leaderboard - Embed",
  description: "Embeddable leaderboard for ZAO Community Respect",
};

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-auto">{children}</body>
    </html>
  );
}
