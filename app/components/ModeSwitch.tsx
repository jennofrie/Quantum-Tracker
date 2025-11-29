"use client";

import { motion } from "framer-motion";
import { Plane, MapPin } from "lucide-react";
import { SearchMode } from "../utils/flightHistory";

interface ModeSwitchProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="glass-surface rounded-2xl p-2 inline-flex items-center gap-2">
      <button
        onClick={() => onChange("flight-status")}
        className={`relative px-6 py-3 rounded-xl font-cinzel text-sm uppercase tracking-wider transition-all ${
          mode === "flight-status"
            ? "text-abyss"
            : "text-silver-metallic hover:text-white"
        }`}
      >
        {mode === "flight-status" && (
          <motion.div
            layoutId="mode-bg"
            className="absolute inset-0 bg-amber-electric rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Plane className="w-4 h-4" />
          Flight Status
        </span>
      </button>

      <button
        onClick={() => onChange("trip-planning")}
        className={`relative px-6 py-3 rounded-xl font-cinzel text-sm uppercase tracking-wider transition-all ${
          mode === "trip-planning"
            ? "text-abyss"
            : "text-silver-metallic hover:text-white"
        }`}
      >
        {mode === "trip-planning" && (
          <motion.div
            layoutId="mode-bg"
            className="absolute inset-0 bg-amber-electric rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Trip Planning
        </span>
      </button>
    </div>
  );
}

