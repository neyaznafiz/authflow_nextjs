"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { verifySession, logout } from "@/lib/utils";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; identifier: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await verifySession();
        setUser({
          name: userData.name,
          identifier: userData.identifier,
        });
      } catch (error) {
        console.error("Session verification failed:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-zinc-400 font-light tracking-widest uppercase text-xs">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      {/* Navigation */}
      <nav className="bg-white border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-zinc-900" />
            <span className="font-medium tracking-tight text-zinc-900">Workspace</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <header className="mb-12">
            <h1 className="text-4xl font-light tracking-tight text-zinc-900">
              Welcome to dashboard
            </h1>
            <p className="text-zinc-400 mt-2 font-light">
              Everything you need, all in one place.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 border border-zinc-100 rounded-2xl">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-medium text-zinc-900 mb-1">Profile</h3>
              <p className="text-xs text-zinc-400 font-light mb-4">
                {user?.name || "User"}
              </p>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-zinc-300">
                {user?.identifier || "Not available"}
              </div>
            </div>

            <div className="bg-white p-8 border border-zinc-100 rounded-2xl md:col-span-2">
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs text-zinc-600 font-light">System update completed</span>
                    </div>
                    <span className="text-[10px] text-zinc-300 uppercase tracking-widest font-medium">2h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
