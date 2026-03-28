import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Create a new, secure password for your AuthFlow account and regain access to your dashboard.",
};

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
