"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plane, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // On dashboard, logo is not clickable (security)
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-white/5 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Conditional clickability */}
          {isDashboard ? (
            <div className="flex items-center gap-3 cursor-default">
              <div className="w-10 h-10 rounded-xl bg-amber-electric/10 flex items-center justify-center border border-amber-electric/30">
                <Plane className="w-5 h-5 text-amber-electric" />
              </div>
              <div>
                <h1 className="text-lg font-playfair font-bold text-white leading-none">
                  Quantum Tracker
                </h1>
                <p className="text-[10px] text-silver-metallic font-cinzel uppercase tracking-wider">
                  Flight Intelligence
                </p>
              </div>
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-electric/10 flex items-center justify-center border border-amber-electric/30 group-hover:border-amber-electric/60 transition-colors">
                <Plane className="w-5 h-5 text-amber-electric" />
              </div>
              <div>
                <h1 className="text-lg font-playfair font-bold text-white leading-none">
                  Quantum Tracker
                </h1>
                <p className="text-[10px] text-silver-metallic font-cinzel uppercase tracking-wider">
                  Flight Intelligence
                </p>
              </div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isDashboard && navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-cinzel text-silver-metallic hover:text-white transition-colors uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
            
            {pathname === "/dashboard" ? (
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="px-6 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-cinzel text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            ) : pathname === "/login" ? (
               <Link
                href="/"
                className="text-sm font-cinzel text-silver-metallic hover:text-white transition-colors uppercase tracking-wider"
              >
                Back to Home
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg bg-amber-electric/10 border border-amber-electric/30 text-amber-electric hover:bg-amber-electric/20 transition-all font-cinzel text-sm uppercase tracking-wider"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 glass-surface border-b border-white/5 p-4 flex flex-col gap-4"
        >
          {!isDashboard && navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-cinzel text-silver-metallic hover:text-white transition-colors uppercase tracking-wider py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
           {pathname === "/dashboard" ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                disabled={isSigningOut}
                className="text-center px-6 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-cinzel text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            ) : pathname === "/login" ? (
               <Link
                href="/"
                 className="text-center px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-cinzel text-sm uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Back to Home
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-center px-6 py-2 rounded-lg bg-amber-electric/10 border border-amber-electric/30 text-amber-electric hover:bg-amber-electric/20 transition-all font-cinzel text-sm uppercase tracking-wider"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
        </motion.div>
      )}
    </nav>
  );
}

