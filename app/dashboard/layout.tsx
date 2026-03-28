import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Workspace",
    description: "Your personalized AuthFlow workspace. Manage your profile and security settings.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
