"use client";

import { motion } from "framer-motion";
import { Activity, Globe, ShieldCheck } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Status",
      description:
        "Instant access to precision flight data including arrival and departure times, terminal allocations, and gate assignments. Our direct feed ensures you are always synchronized with the tarmac.",
    },
    {
      icon: Globe,
      title: "Trip Planning Intelligence",
      description:
        "Leverage our 'Price Scout' deep linking technology to instantly scout global routes. Input your IATA codes and dates to generate direct pricing intelligence from leading carriers.",
    },
    {
      icon: ShieldCheck,
      title: "Data Logging & Security",
      description:
        "A secure, persistent log of your reconnaissance activities. Your search history is encrypted and stored locally, ensuring your travel intelligence remains private and accessible only to you.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative bg-abyss">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-teal-dim rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-amber-electric/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
            System Capabilities
          </h1>
          <p className="text-silver-metallic font-cinzel text-sm md:text-base uppercase tracking-widest max-w-2xl mx-auto">
            Advanced tools for the modern aviator and traveler
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-surface p-8 rounded-2xl group border border-white/5 hover:border-amber-electric/30 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-electric/10 flex items-center justify-center border border-amber-electric/20 mb-6 group-hover:border-amber-electric/50 transition-colors">
                <feature.icon className="w-8 h-8 text-amber-electric" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-silver-metallic font-jetbrains text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

