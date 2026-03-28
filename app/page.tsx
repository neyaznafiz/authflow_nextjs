"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { 
    Sparkles, 
    ShieldCheck, 
    Lock, 
    Zap, 
    RefreshCw, 
    CheckCircle, 
    ArrowRight, 
    Fingerprint,
    Shield,
    Smartphone,
    Database,
    Github
} from "lucide-react";
import { useRef } from "react";

export default function LandingHome() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const features = [
        {
            icon: ShieldCheck,
            title: "Dual-Token JWT",
            description: "Industry-standard access and refresh token rotation with secure HTTP-only cookies to prevent XSS attacks."
        },
        {
            icon: Lock,
            title: "Strict Security",
            description: "Bcryptjs hashing for passwords and secure crypto-generated reset tokens with strict 1-hour expiration."
        },
        {
            icon: Zap,
            title: "OTP Verification",
            description: "Instant 6-digit OTP codes for account verification with a 60-second cooldown to prevent API spamming."
        },
        {
            icon: RefreshCw,
            title: "Silent Refresh",
            description: "Seamless background session renewal using HTTP-only cookies, keeping users signed in without interruption."
        },
        {
            icon: Smartphone,
            title: "Responsive UX",
            description: "A beautifully animated, mobile-first interface built with React 19 and Framer Motion for a premium feel."
        },
        {
            icon: Database,
            title: "MongoDB Powered",
            description: "Robust data persistence using Mongoose and MongoDB, storing everything from user profiles to active JWT sessions."
        }
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-transparent overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    style={{ opacity, scale }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/3 border border-zinc-900/5 mb-8">
                        <Sparkles className="w-3 h-3 text-zinc-900" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Next.js 15 Ready &bull; MongoDB Ready</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-zinc-900 leading-[1.05] mb-8">
                        The ultimate <br />
                        <span className="font-semibold italic">Authentication</span> framework
                    </h1>

                    <p className="text-xl md:text-2xl font-light text-zinc-500 max-w-2xl mx-auto leading-relaxed mb-12">
                        An Open Source, highly secure, and beautifully designed authentication system for Next.js that handles the heavy lifting, so you can build.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="https://github.com/neyaznafiz/authflow_nextjs" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-2xl shadow-zinc-900/20 active:scale-95">
                            Start Building Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="https://github.com/neyaznafiz/authflow_nextjs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-full font-bold uppercase tracking-widest text-xs hover:border-zinc-900 transition-all active:scale-95">
                            <Github className="w-4 h-4" />
                            GitHub Repository
                        </Link>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <div className="w-px h-16 bg-linear-to-b from-zinc-200 to-transparent mx-auto" />
                    <span className="block text-[8px] uppercase tracking-[0.3em] font-bold text-zinc-400 mt-4">Scroll to explorer</span>
                </motion.div>
            </section>

            {/* Product Preview Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Architecture</h2>
                            <h3 className="text-3xl md:text-5xl font-light tracking-tight text-zinc-900 mb-8 leading-tight">
                                Built for <span className="font-semibold underline decoration-indigo-500/30">uncompromised</span> security and performance.
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    { title: "Dual Token Rotation", desc: "Short-lived access tokens combined with long-lived secure refresh tokens." },
                                    { title: "HTTP-Only Storage", desc: "Instantly vaults refresh tokens into strict, secure HTTP-only cookies." },
                                    { title: "Cryptographic Protection", desc: "End-to-end security using bcryptjs and production-grade crypto modules." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-zinc-900 text-sm tracking-tight">{item.title}</p>
                                            <p className="text-zinc-500 text-sm font-light leading-relaxed">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square sm:aspect-video rounded-3xl bg-zinc-900 border border-zinc-800 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] overflow-hidden p-1">
                                <div className="w-full h-full rounded-[22px] bg-zinc-950 flex flex-col">
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                                        </div>
                                        <div className="mx-auto text-[10px] text-zinc-500 font-mono tracking-widest pl-4">auth/signin</div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-8">
                                        <div className="w-full max-w-sm space-y-4 opacity-50 blur-[2px]">
                                            <div className="h-2 w-12 bg-zinc-800 rounded mx-auto" />
                                            <div className="h-8 w-24 bg-zinc-800 rounded-full mx-auto" />
                                            <div className="space-y-2 pt-4">
                                                <div className="h-0.5 w-full bg-zinc-800 rounded" />
                                                <div className="h-0.5 w-full bg-zinc-800 rounded" />
                                            </div>
                                            <div className="h-10 w-full bg-zinc-800 rounded-full" />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div 
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex items-center gap-4"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400">
                                                    <Fingerprint className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Authenticated</p>
                                                    <p className="text-white text-sm font-semibold tracking-tight">Session Established</p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative blurs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 border-t border-zinc-100 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center max-w-2xl mx-auto">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-4">Features</h2>
                        <h3 className="text-3xl md:text-5xl font-light tracking-tight text-zinc-900 mb-6">Everything you need for a <span className="italic font-normal">world-class</span> login experience.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/40 border border-zinc-100 hover:border-zinc-900/10 hover:shadow-2xl hover:shadow-zinc-900/5 transition-all duration-500"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-zinc-900" />
                                </div>
                                <h4 className="text-lg font-semibold text-zinc-900 mb-3 tracking-tight">{feature.title}</h4>
                                <p className="text-zinc-500 text-sm font-light leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-12 md:p-24 rounded-[40px] bg-zinc-900 text-white overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Ready to secure <br /><span className="font-semibold italic">your applications?</span></h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/signin" className="px-8 py-4 border border-zinc-800 text-zinc-400 rounded-full font-bold uppercase tracking-widest text-xs transition-colors hover:text-white hover:border-white">
                                    Sign In To Dashboard
                                </Link>
                            </div>
                        </div>
                        {/* Background blobs for CTA */}
                        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
