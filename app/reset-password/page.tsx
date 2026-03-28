"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

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
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md p-1"
        >
            <div className="bg-white/[0.6] backdrop-blur-3xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[20px] p-8 sm:p-12 overflow-hidden relative">

                <div className="mb-8 text-center">
                    <motion.div 
                        initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-zinc-900/20"
                    >
                        <KeyRound className="w-6 h-6 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                        Reset Password
                    </h1>
                    <p className="text-zinc-500 text-sm mt-3 font-light tracking-wide">
                        Create a new secure password for your account
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className={clsx(
                                "mb-8 text-sm text-center font-medium",
                                status.type === "success"
                                    ? "text-emerald-600"
                                    : "text-red-600",
                            )}
                        >
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!token ? (
                    <div className="text-center py-4">
                        <p className="text-zinc-500 text-sm font-light mb-8 leading-relaxed">
                            It seems your reset link is invalid or has expired. 
                            Please request a new one to continue.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Forgot Password
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-8 pr-4 pt-2 pb-2 bg-zinc-50/50 border-b border-zinc-200  transition-all duration-300 placeholder:text-zinc-400 text-sm font-medium focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-8 pr-4 pt-2 pb-2 bg-zinc-50/50 border-b border-zinc-200  transition-all duration-300 placeholder:text-zinc-400 text-sm font-medium focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-xl shadow-zinc-900/10 overflow-hidden relative sm:col-span-2 mt-2"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Update Password"
                                )}
                            </span>
                        </button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-zinc-50 overflow-hidden">
             {/* Background Abstract Decorative Elements - Theme Consistency */}
             <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        x: [0, -40, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/15 blur-[120px]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]" />
            </div>

            <Suspense
                fallback={
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                        <p className="text-sm text-zinc-400 font-light">Loading...</p>
                    </div>
                }
            >
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
