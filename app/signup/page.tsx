"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    ShieldCheck,
} from "lucide-react";
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

            console.log("Sign up success:", result, "OTP:", result.otp);
            setStatus({
                type: "success",
                message: "Account created! Redirecting to verification...",
            });

            setTimeout(() => { 
                router.push(`/verify-otp?email=${encodeURIComponent(data.identifier as string)}&devOtp=${result.otp}`); 
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
                        Sign up
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-light">
                        Create your account
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
                            Full Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="input-field"
                        />
                    </div>

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
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">
                            Password
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
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-12">
                    <p className="text-xs text-zinc-400 font-light">
                        Already have an account?{" "}
                        <Link
                            href="/"
                            className="text-zinc-900 font-medium hover:underline underline-offset-8"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
