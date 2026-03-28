"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-10 w-full py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
                            <div className="bg-zinc-900 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-900/10 group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-light tracking-tight text-zinc-900">
                                Auth<span className="font-semibold">Flow</span>
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-sm">
                            A high-performance, secure authentication framework designed for modern web applications. Experience seamless integration and premium security.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">
                            Product
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="https://github.com/neyaznafiz/authflow_nextjs" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light">Documentation</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">
                            Company
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="https://bitlaab.com/about" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light">About Us</Link>
                            </li>
                            <li>
                                <Link href="https://bitlaab.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="https://bitlaab.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-zinc-400 text-xs font-light tracking-wide">
                        &copy; {currentYear} AuthFlow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="https://github.com/neyaznafiz/authflow_nextjs" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://twitter.com/bitlaab" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="https://www.linkedin.com/company/bitlaab/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        </footer>
    );
}
