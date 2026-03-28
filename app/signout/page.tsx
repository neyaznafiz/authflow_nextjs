"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Securely closing your session...");

    useEffect(() => {
        const performSignOut = async () => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                try {
                    await fetch("/api/auth/signout", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } catch (err) {
                    console.error("Error signing out from server");
                }
            }

            // Clear local storage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");

            setMessage("You have been signed out.");

            // Delay for a beautiful animated exit to login page
            setTimeout(() => {
                router.push("/");
            }, 1000);
        };

        performSignOut();
    }, [router]);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-zinc-50 overflow-hidden text-center">
             {/* Background Abstract Decorative Elements - Theme Consistency */}
             <div className="absolute inset-0 z-0 text-left">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex flex-col items-center justify-center space-y-10"
            >
                {/* Minimalist Loader */}
                <Loader2 className="w-10 h-10 text-zinc-900 animate-spin" strokeWidth={1.5} />

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="text-2xl font-light tracking-tight text-zinc-900 uppercase"
                    >
                        Signing Out
                    </motion.h1>
                    <div className="h-6 flex items-center justify-center overflow-hidden">
                        <motion.p
                            key={message}
                            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.5 }}
                            className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-bold"
                        >
                            {message}
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
