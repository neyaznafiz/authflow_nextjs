import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import BackgroundElements from "./components/BackgroundElements";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "AuthFlow | Premium Authentication Framework",
        template: "%s | AuthFlow",
    },
    description: "A clean, highly secure, and beautifully designed authentication system built with Next.js 15, React 19, and MongoDB.",
    keywords: ["Next.js", "Authentication", "React 19", "MongoDB", "AuthFlow", "Secure Auth", "JWT", "Auth Starter"],
    authors: [{ name: "AuthFlow Team" }],
    creator: "AuthFlow",
    publisher: "Bitlaab",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("https://authflownext.vercel.app"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "AuthFlow | Premium Authentication Framework",
        description: "Secure, beautiful, and developer-friendly authentication for your Next.js applications.",
        url: "https://authflownext.vercel.app",
        siteName: "AuthFlow",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "AuthFlow OpenGraph Image",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "AuthFlow | Premium Authentication Framework",
        description: "Secure, beautiful, and developer-friendly authentication for your Next.js applications.",
        images: ["/og-image.png"],
        creator: "@bitlaab",
    },
    icons: {
        icon: "/icon.svg",
        apple: "/icon.svg",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <BackgroundElements />
                <ServiceWorkerRegistration />
                <Header />
                <main className="relative z-10 pt-16">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
