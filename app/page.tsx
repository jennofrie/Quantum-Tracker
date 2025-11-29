"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2948&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss/95 to-abyss" />
      
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-teal-dim/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-amber-electric/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white leading-tight mb-4">
              Global Flight <br />
              <span className="bg-gradient-to-r from-amber-electric via-white to-amber-electric bg-clip-text text-transparent bg-[200%_auto] animate-gradient">
                Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-silver-metallic font-cinzel max-w-2xl mx-auto leading-relaxed">
              Precision data for informed travel decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-amber-electric text-abyss font-bold font-cinzel text-lg rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Get Started
              </button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold font-cinzel text-lg rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group backdrop-blur-sm">
                Explore Features
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left"
          >
            {[
              {
                icon: Globe,
                title: "Global Coverage",
                desc: "Real-time tracking across all major international airports.",
              },
              {
                icon: Zap,
                title: "Live Updates",
                desc: "Instant status changes with sub-second latency.",
              },
              {
                icon: Shield,
                title: "Secure Access",
                desc: "Enterprise-grade encryption for all flight data requests.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-electric/20 transition-colors backdrop-blur-sm group"
              >
                <feature.icon className="w-8 h-8 text-amber-electric mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-playfair font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm font-jetbrains text-silver-metallic leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </main>
  );
}
