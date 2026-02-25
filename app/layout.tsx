import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuthFlow",
  description: "A clean and modern authentication system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
