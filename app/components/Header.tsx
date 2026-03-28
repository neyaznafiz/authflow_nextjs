"use client";

import Link from "next/link";
import { Sparkles, Github } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    
    // Hide header on dashboard if needed, or modify it
    // For now, let's keep it visible everywhere as requested
    const isAuthPage = ["/signin", "/signup", "/verify-otp", "/forgot-password", "/reset-password"].includes(pathname);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-zinc-900/5">
            <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 py-4 md:px-12">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-zinc-900 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-900/10 transition-transform group-hover:scale-110">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-light tracking-tight text-zinc-900">
                            Auth<span className="font-semibold">Flow</span>
                        </span>
                    </Link>
                    
                    {pathname.startsWith("/dashboard") && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/5 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Workspace</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-6">
                    <Link 
                        href="https://github.com/neyaznafiz/authflow_nextjs" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors uppercase tracking-widest text-[10px]"
                    >
                        Docs
                    </Link>

                    {!pathname.startsWith("/dashboard") && (
                        <Link 
                            href="/signin" 
                            className="px-5 py-2 bg-zinc-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
                        >
                            Try It
                        </Link>
                    )}

                    {pathname.startsWith("/dashboard") && (
                        <Link 
                            href="/signout" 
                            className="px-5 py-2 bg-zinc-900/5 hover:bg-zinc-900/10 text-zinc-900 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                        >
                            Sign Out
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
