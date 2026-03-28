"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, ArrowLeft } from "lucide-react";
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
                router.push("/");
            }, 1000);
        } catch (error: any) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="auth-card w-full max-w-sm"
        >
            <div className="mb-12">
                <Link
                    href="/signup"
                    className="inline-flex items-center text-xs text-zinc-400 hover:text-zinc-900 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to sign up
                </Link>
                <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                    Verify Account
                </h1>
                <p className="text-zinc-400 text-sm mt-2 font-light">
                    Enter the 6-digit code sent to your email
                </p>
            </div>

            {status && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                        "mb-8 text-sm",
                        status.type === "success"
                            ? "text-emerald-600"
                            : "text-red-600",
                    )}
                >
                    {status.message}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                        Email
                    </label>
                    <input
                        name="identifier"
                        type="text"
                        required
                        defaultValue={emailStr}
                        readOnly={!!emailStr}
                        className={clsx("input-field", emailStr && "text-zinc-500 bg-zinc-50 border-zinc-200 cursor-not-allowed")}
                    />
                </div>
                
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
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
                        className="input-field tracking-[0.5em] text-center font-medium"
                    />
                </div>

                <div className="flex flex-col gap-4 mt-8">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            "Verify Account"
                        )}
                    </button>
                    
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={timeLeft > 0 || isResending}
                            className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isResending ? (
                                "Resending..."
                            ) : timeLeft > 0 ? (
                                `Resend OTP in ${timeLeft}s`
                            ) : (
                                "Resend OTP"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {currentDevOtp && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-zinc-50 border border-zinc-100 rounded-lg shadow-sm"
                >
                    <p className="text-xs text-zinc-900 font-medium mb-2 uppercase tracking-wider">Generated OTP:</p>
                    <div className="text-lg tracking-[0.5em] text-zinc-600 font-medium transition-colors">
                        {currentDevOtp}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-3 font-medium uppercase tracking-widest">
                        Send this OTP to the user email in production
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}

export default function VerifyOTP() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            <Suspense fallback={<div className="text-sm text-zinc-400 font-light w-full max-w-sm">Loading verification...</div>}>
                <VerifyOTPContent />
            </Suspense>
        </div>
    );
}
