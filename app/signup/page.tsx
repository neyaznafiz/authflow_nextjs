"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import { clsx } from "clsx";

export default function SignUp() {
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
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match" });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    identifier: data.identifier,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            setStatus({
                type: "success",
                message: "Account created! Redirecting to verification...",
            });

            setTimeout(() => {
                router.push(
                    `/verify-otp?email=${encodeURIComponent(data.identifier as string)}&devOtp=${result.otp}`,
                );
            }, 1000);
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-zinc-50 overflow-hidden">
            {/* Background Abstract Decorative Elements - Matches Sign In */}
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
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg p-1"
            >
                <div className="bg-white/[0.6] backdrop-blur-3xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-12 overflow-hidden relative">

                    <div className="mb-8 text-center">
                        <motion.div 
                            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-zinc-900/20"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                            Create Account
                        </h1>
                        <p className="text-zinc-500 text-sm mt-3 font-light tracking-wide">
                            Join us and start your journey today
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

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-8 pr-4 pt-2 pb-2 bg-zinc-50/50 border-b border-zinc-200  transition-all duration-300 placeholder:text-zinc-400 text-sm font-medium focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                                Email Address
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
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                                Password
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
                                Confirm
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
                                    "Create Account"
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-14 text-center">
                        <p className="text-xs text-zinc-500 font-light tracking-wide">
                            Already have an account?{" "}
                            <Link
                                href="/"
                                className="text-zinc-600 font-semibold uppercase text-[11px]"
                            >
                                Back to Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
