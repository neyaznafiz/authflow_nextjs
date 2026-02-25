"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus({
                type: "error",
                message: "Invalid or missing reset token.",
            });
        }
    }, [token]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;

        setIsLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match" });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            setStatus({
                type: "success",
                message: "Password reset successful! Redirecting to sign in...",
            });

            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="auth-card w-full max-w-sm"
            >
                <div className="mb-12">
                    <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                        Reset password
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-light">
                        Create a new secure password
                    </p>
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "mb-8 text-sm flex items-center",
                            status.type === "success"
                                ? "text-emerald-600"
                                : "text-red-600",
                        )}
                    >
                        {status.type === "success" && (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        {status.message}
                    </motion.div>
                )}

                {!token ? (
                    <div className="text-center">
                        <p className="text-zinc-400 text-sm font-light mb-8">
                            Please request a new reset link if the current one
                            is invalid or expired.
                        </p>
                        <a href="/forgot-password" title="Forgot Password" className="btn-primary inline-block">
                            Go to Forgot Password
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                                New Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                                Confirm Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="input-field"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
