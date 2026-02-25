"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

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
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs text-zinc-400 hover:text-zinc-900 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to sign in
                    </Link>
                    <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                        Forgot password
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-light">
                        Enter your identifier to reset your password
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
                            Email or Phone
                        </label>
                        <input
                            name="identifier"
                            type="text"
                            required
                            placeholder="Enter your identifier"
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
                            "Send Reset Link"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
