import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Human Wall",
  description: "One verified human. One message.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
