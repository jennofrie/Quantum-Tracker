"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Plane } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// Simple allowlist for demonstration
const ALLOWED_EMAILS = [
  "admin@quantumtracker.com",
  "pilot@quantumtracker.com",
  "daguiljennofrie@gmail.com",
  "angela08moss@gmail.com",
  // Add your allowed emails here
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // 2. Client-side Authorization Check (Optional Allowlist)
      // Note: effective security requires Server-Side or RLS enforcement
      if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
        setError("Access denied: Your email is not authorized.");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2948&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/80 via-abyss/90 to-abyss" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-surface p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-electric/10 flex items-center justify-center border border-amber-electric/30 mx-auto mb-4">
              <Plane className="w-8 h-8 text-amber-electric" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-silver-metallic font-cinzel text-xs uppercase tracking-widest">
              Access Flight Intelligence
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-cinzel text-silver-metallic uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-metallic/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-jetbrains placeholder:text-white/20 focus:outline-none focus:border-amber-electric/50 transition-colors"
                  placeholder="pilot@quantumtracker.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-cinzel text-silver-metallic uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-metallic/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-jetbrains placeholder:text-white/20 focus:outline-none focus:border-amber-electric/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white/10 border border-white/10 text-white font-cinzel font-bold rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs font-jetbrains text-center mt-2"
              >
                {error}
              </motion.p>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-silver-metallic font-jetbrains">
              Don't have an account?{" "}
              <button
                onClick={() => console.log("Navigate to signup")}
                className="text-amber-electric hover:underline hover:text-white transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

