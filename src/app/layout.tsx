import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bonnetjes Cafe - Order Management",
  description: "Cafe order tracking and management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
