import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Recover your AuthFlow workspace access with our secure password recovery system.",
};

export default function ForgotPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
