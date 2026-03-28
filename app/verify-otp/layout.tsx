import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Verify Account",
    description: "Verify your email with the 6-digit OTP code to complete your registration.",
};

export default function VerifyOTPLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
