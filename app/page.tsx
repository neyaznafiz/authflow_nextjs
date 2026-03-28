"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { clsx } from "clsx";

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        // Check if already logged in
        const token = localStorage.getItem("accessToken");
        if (token) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier: data.identifier,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Invalid credentials");
            }

            // Store data in localStorage
            if (result.accessToken) {
                localStorage.setItem("accessToken", result.accessToken);
            }

            setStatus({
                type: "success",
                message: `Welcome back, ${result.user?.name || "User"}! Redirecting...`,
            });

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-zinc-50 overflow-hidden">
            {/* Background Abstract Decorative Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                        x: [0, -40, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-1"
            >
                <div className="bg-white/[0.6] backdrop-blur-3xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-12 overflow-hidden relative">

                    <div className="mb-10 text-center">
                        <motion.div 
                            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-zinc-900/20"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                            Welcome Back
                        </h1>
                        <p className="text-zinc-500 text-sm mt-3 font-light tracking-wide">
                            Enter your details to access your workspace
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    name="identifier"
                                    type="text"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-8 pr-4 pt-2 pb-2 bg-zinc-50/50 border-b border-zinc-200  transition-all duration-300 placeholder:text-zinc-400 text-sm font-medium focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-500"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-xl shadow-zinc-900/10 overflow-hidden relative sm:col-span-2 mt-2"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-14 text-center">
                        <p className="text-xs text-zinc-500 font-light tracking-wide">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-zinc-600 font-semibold uppercase text-[11px]"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
                
                {/* Secondary Abstract Background element */}
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
            </motion.div>
        </div>
    );
}
