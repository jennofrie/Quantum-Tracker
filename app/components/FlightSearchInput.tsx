"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Search, History } from "lucide-react";
import { getFlightHistory, FlightHistoryItem } from "../utils/flightHistory";

interface FlightSearchInputProps {
  onSearch: (flightNumber: string) => void;
  isLoading: boolean;
}

export default function FlightSearchInput({
  onSearch,
  isLoading,
}: FlightSearchInputProps) {
  const [flightNumber, setFlightNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<FlightHistoryItem[]>([]);

  useEffect(() => {
    // Load only flight-status history
    const allHistory = getFlightHistory();
    setHistory(allHistory.filter((item) => item.mode === "flight-status"));
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (flightNumber.trim() && !isLoading) {
      onSearch(flightNumber.trim().toUpperCase());
      // Refresh history after search
      setTimeout(() => {
        const allHistory = getFlightHistory();
        setHistory(allHistory.filter((item) => item.mode === "flight-status"));
      }, 100);
    }
  };

  const handleHistoryClick = (flight: string) => {
    if (!isLoading) {
      setFlightNumber(flight);
      onSearch(flight);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`glass-surface rounded-2xl p-6 transition-all duration-300 ${
            isFocused ? "scanning-effect border-amber-electric/40" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-amber-electric/10 flex items-center justify-center border border-amber-electric/30">
                <Plane className="w-6 h-6 text-amber-electric" />
              </div>
            </div>

            <div className="flex-1">
              <label
                htmlFor="flight-input"
                className="block text-xs font-cinzel text-silver-metallic uppercase tracking-wider mb-2"
              >
                Flight IATA Code
              </label>
              <input
                id="flight-input"
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="e.g., BA123 or BA123, AA100"
                disabled={isLoading}
                className="w-full bg-transparent border-none outline-none text-2xl font-jetbrains text-white placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="off"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !flightNumber.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-6 py-3 bg-amber-electric text-abyss font-cinzel font-semibold rounded-xl hover:bg-amber-electric/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </motion.button>
          </div>
          
          {/* Multi-flight hint */}
          <div className="mt-3 text-center">
            <p className="text-[10px] font-jetbrains text-silver-metallic/40 uppercase tracking-wider">
              Tip: Separate multiple flights with commas for connection tracking
            </p>
          </div>
        </div>

        {/* Subtle bottom glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0.3 : 0 }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-electric/50 blur-2xl rounded-full -z-10"
        />
      </form>

      {/* Flight History Tags */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <History className="w-3 h-3 text-silver-metallic/50" />
              <span className="text-xs font-cinzel text-silver-metallic/50 uppercase tracking-wider">
                Recent Searches
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => {
                if (!item.flightNumber) return null;
                return (
                  <motion.button
                    key={item.flightNumber}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => handleHistoryClick(item.flightNumber!)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 border border-silver-metallic/20 rounded-lg font-jetbrains text-sm text-white/70 hover:border-amber-electric/60 hover:text-amber-electric hover:bg-amber-electric/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {item.flightNumber}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

