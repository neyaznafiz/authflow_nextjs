"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailStr = searchParams.get("email") || "";
    const devOtp = searchParams.get("devOtp");

    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentDevOtp, setCurrentDevOtp] = useState<string | null>(devOtp);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleResendOTP = async () => {
        if (timeLeft > 0 || !emailStr) return;
        setIsResending(true);
        setStatus(null);

        try {
            const response = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier: emailStr }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to resend OTP");
            }

            setStatus({
                type: "success",
                message: "A new OTP has been sent to your email.",
            });
            setCurrentDevOtp(result.otp);
            setTimeLeft(60);
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const otp = formData.get("otp");
        const identifier = formData.get("identifier");

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identifier, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Invalid OTP");
            }

            setStatus({
                type: "success",
                message: "Verification successful! Redirecting to sign in...",
            });

            setTimeout(() => {
                router.push("/signin");
            }, 1000);
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
                <div className="mb-8">
                    <Link
                        href="/signup"
                        className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group ml-1"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to sign up
                    </Link>

                    <div className="text-center">
                        <motion.div 
                            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="bg-zinc-900 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-zinc-900/20"
                        >
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                            Verify Account
                        </h1>
                        <p className="text-zinc-500 text-sm mt-3 font-light tracking-wide">
                            Enter the 6-digit code sent to your email
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
                            Email
                        </label>
                        <input
                            name="identifier"
                            type="text"
                            required
                            defaultValue={emailStr}
                            readOnly={!!emailStr}
                            className={clsx(
                                "w-full px-2 py-2  border-b border-zinc-200 focus:outline-none transition-all duration-300 text-sm font-medium",
                                emailStr &&
                                    "text-zinc-400 cursor-not-allowed",
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 ml-1">
                            6-Digit OTP
                        </label>
                        <input
                            name="otp"
                            type="text"
                            required
                            placeholder="123456"
                            maxLength={6}
                            pattern="\d{6}"
                            title="Enter exactly 6 digits"
                            className="w-full px-5 py-3 bg-zinc-50/50 border-b border-zinc-200 focus:outline-none transition-all duration-300 placeholder:text-zinc-300 text-2xl tracking-[0.5em] text-center font-bold text-zinc-900"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 shadow-xl shadow-zinc-900/10 overflow-hidden relative sm:col-span-2 mt-2"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Verify Account"
                                )}
                            </span>
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={timeLeft > 0 || isResending}
                                className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isResending
                                    ? "Resending..."
                                    : timeLeft > 0
                                      ? `Resend OTP in ${timeLeft}s`
                                      : "Resend OTP"}
                            </button>
                        </div>
                    </div>
                </form>

                {currentDevOtp && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 p-5 "
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/20 transition-colors" />
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-3">
                            Developer Debug Output
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="bg-zinc-900 px-4 py-2 rounded-xl">
                                <span className="text-lg tracking-[0.4em] text-white font-mono font-bold">
                                    {currentDevOtp}
                                </span>
                            </div>
                            <p className="text-[11.6px] text-zinc-500 max-w-[150px]">
                                Send this OTP to the user's email in real application.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default function VerifyOTP() {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-transparent overflow-hidden">

            <Suspense
                fallback={
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                        <p className="text-sm text-zinc-400 font-light">Loading verification...</p>
                    </div>
                }
            >
                <VerifyOTPContent />
            </Suspense>
        </div>
    );
}
