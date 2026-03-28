"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowLeft, Loader2, Sparkles, KeyRound } from "lucide-react";
import { clsx } from "clsx";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [resetLink, setResetLink] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        setResetLink(null);

        const formData = new FormData(e.currentTarget);
        const identifier = formData.get("identifier");

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            setStatus({
                type: "success",
                message: result.message,
            });
            if (result.resetLink) {
                setResetLink(result.resetLink);
            }
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

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
                className="relative z-10 w-full max-w-md p-1"
            >
                <div className="bg-white/[0.6] backdrop-blur-3xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-12 overflow-hidden relative">

                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group ml-1"
                        >
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to sign in
                        </Link>

                        <div className="text-center">
                            <motion.div 
                                initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-zinc-900/20"
                            >
                                <KeyRound className="w-6 h-6 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                                Forgot Password
                            </h1>
                            <p className="text-zinc-500 text-sm mt-3 font-light tracking-wide">
                                Enter your identifier to reset your access
                            </p>
                        </div>
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
                                    placeholder="Enter your registered identifier"
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
                                    "Send Reset Link"
                                )}
                            </span>
                        </button>
                    </form>

                    {resetLink && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-10 p-5 overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 blur-2xl -mr-12 -mt-12" />
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">
                                Reset Link
                            </p>

                            <p className="text-[10px] text-zinc-600 mb-2 leading-relaxed uppercase tracking-[0.1em]">
                                Click to use this link for resetting password.
                            </p>

                            <a
                                href={resetLink}
                                title="Open Reset Link"
                                className="text-xs text-zinc-900 hover:underline break-all font-mono tracking-tight"
                            >
                                {resetLink}
                            </a>

                            <p className="text-[12px] text-zinc-600 mt-6 uppercase">
                                Send this link to the user's provided email address in your actual application.
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
