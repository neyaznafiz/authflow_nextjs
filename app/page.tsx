"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
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

            console.log("Sign in success:", result);

            // Store data in localStorage
            if (result.accessToken) {
                localStorage.setItem("accessToken", result.accessToken);
            }
            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
            }

            setStatus({
                type: "success",
                message: `Welcome back, ${result.user.name}! Redirecting...`,
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="auth-card w-full max-w-sm"
            >
                <div className="mb-12">
                    <h1 className="text-3xl font-light tracking-tight text-zinc-900">
                        Sign in
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-light">
                        Access your workspace
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
                            placeholder="name@example.com"
                            className="input-field"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <input
                            name="password"
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
                            "Continue"
                        )}
                    </button>
                </form>

                <div className="mt-12">
                    <p className="text-xs text-zinc-400 font-light">
                        New here?{" "}
                        <Link
                            href="/signup"
                            className="text-zinc-900 font-medium hover:underline underline-offset-8"
                        >
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
