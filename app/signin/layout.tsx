import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Access your AuthFlow workspace securely. Enter your credentials to continue.",
};

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
