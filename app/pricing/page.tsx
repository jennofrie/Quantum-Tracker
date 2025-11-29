"use client";

import { motion } from "framer-motion";
import { Check, Plane } from "lucide-react";

export default function PricingPage() {
  const tiers = [
    {
      name: "Free Scout",
      price: "$0",
      period: "/month",
      description: "Essential tools for the occasional traveler.",
      features: [
        "Access to Price Scout",
        "Limited Flight Status (3/day)",
        "Basic Search History",
        "Standard Data Refresh",
      ],
      highlighted: false,
      cta: "Get Started",
    },
    {
      name: "Premium Hangar",
      price: "$9.99",
      period: "/month",
      description: "Unrestricted access for the frequent flyer.",
      features: [
        "Unlimited Status Lookup",
        "Unlimited Search History",
        "Advanced Aircraft Data",
        "Ad-Free Experience",
        "Priority Support",
      ],
      highlighted: true,
      cta: "Start Trial",
    },
    {
      name: "Enterprise Intelligence",
      price: "Custom",
      period: "",
      description: "Scalable solutions for aviation professionals.",
      features: [
        "Custom API Access",
        "Fleet Management Tools",
        "Dedicated Account Manager",
        "SLA Guarantees",
        "Custom Data Export",
      ],
      highlighted: false,
      cta: "Contact Sales",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <main className="min-h-screen pt-24 pb-12 px-4 relative bg-abyss flex flex-col">
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

      <div className="container mx-auto max-w-7xl flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
            Access Levels
          </h1>
          <p className="text-silver-metallic font-cinzel text-sm md:text-base uppercase tracking-widest max-w-2xl mx-auto">
            Choose your clearance level
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`glass-surface p-8 rounded-2xl border transition-all duration-300 flex flex-col relative ${
                tier.highlighted
                  ? "border-amber-electric/60 bg-amber-electric/5 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]"
                  : "border-white/5 hover:border-white/20"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-electric text-abyss px-4 py-1 rounded-full text-xs font-cinzel font-bold uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-4xl font-jetbrains font-bold text-amber-electric">
                    {tier.price}
                  </span>
                  <span className="text-silver-metallic font-jetbrains text-sm">
                    {tier.period}
                  </span>
                </div>
                <p className="text-silver-metallic font-jetbrains text-sm">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="text-sm font-jetbrains text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-cinzel font-bold text-sm uppercase tracking-wider transition-colors ${
                  tier.highlighted
                    ? "bg-amber-electric text-abyss hover:bg-amber-electric/90"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                }`}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer / FAQ Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-surface p-8 rounded-2xl max-w-3xl mx-auto border border-white/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <Plane className="w-5 h-5 text-silver-metallic" />
            <h4 className="text-lg font-cinzel font-bold text-white">
              System Disclaimers
            </h4>
          </div>
          <div className="space-y-4 text-xs font-jetbrains text-silver-metallic/70 leading-relaxed">
            <p>
              <strong>Data Accuracy:</strong> Flight data is sourced from global aviation feeds and is subject to provider latency. Quantum Tracker is not responsible for missed connections.
            </p>
            <p>
              <strong>Cancellation Policy:</strong> Subscriptions can be cancelled at any time through your dashboard settings. Access remains active until the end of the billing period.
            </p>
            <p>
              <strong>Enterprise Support:</strong> Custom integrations require a minimum 12-month contract. Contact our flight operations center for details.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

