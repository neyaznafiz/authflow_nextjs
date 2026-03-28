import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create an account with AuthFlow and experience the future of secure authentication.",
};

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
