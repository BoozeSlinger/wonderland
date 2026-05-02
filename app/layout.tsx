import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Last Call Collective",
  description: "Your bar is bleeding money. Let's fix it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=le-murmure@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
