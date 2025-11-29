"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import FlightSearchInput from "../components/FlightSearchInput";
import FlightTicket from "../components/FlightTicket";
import MultiFlightView from "../components/MultiFlightView";
import ModeSwitch from "../components/ModeSwitch";
import TripPlanningForm from "../components/TripPlanningForm";
import { searchFlight } from "../actions/flight-search";
import { FlightSearchResult, MultiFlightResult, SearchResult } from "../types/aviation";
import { saveFlightToHistory, SearchMode } from "../utils/flightHistory";

export default function Dashboard() {
  const [mode, setMode] = useState<SearchMode>("flight-status");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (flightInput: string) => {
    setIsLoading(true);
    setSearchResult(null);

    try {
      // Check if input contains multiple flight numbers (comma-separated)
      const flightNumbers = flightInput
        .split(",")
        .map((f) => f.trim().toUpperCase())
        .filter((f) => f.length > 0);

      if (flightNumbers.length > 1) {
        // Multi-flight search
        const results = await Promise.all(
          flightNumbers.map((flightNumber) => 
            searchFlight(flightNumber).then(result => ({
              ...result,
              flightNumber,
            }))
          )
        );

        // Calculate connection time if we have 2 flights
        let connectionTime;
        if (results.length === 2 && results[0].success && results[1].success) {
          const flight1ArrivalTime = new Date(results[0].data!.arrival.scheduled).getTime();
          const flight2DepartureTime = new Date(results[1].data!.departure.scheduled).getTime();
          const diffMs = flight2DepartureTime - flight1ArrivalTime;
          
          if (diffMs > 0) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            connectionTime = {
              hours,
              minutes,
              isShort: diffMs < 60 * 60 * 1000, // Less than 60 minutes
            };
          }
        }

        const multiResult: MultiFlightResult = {
          isMultiFlight: true,
          flights: results,
          connectionTime,
        };

        setTimeout(() => {
          setSearchResult(multiResult);
          setIsLoading(false);
          
          // Save successful flights to history
          results.forEach((result, index) => {
            if (result.success) {
              saveFlightToHistory(flightNumbers[index]);
            }
          });
        }, 600);
      } else {
        // Single flight search
        const result = await searchFlight(flightNumbers[0]);
        setTimeout(() => {
          setSearchResult(result);
          setIsLoading(false);
          
          if (result.success) {
            saveFlightToHistory(flightNumbers[0]);
          }
        }, 600);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResult({
        success: false,
        error: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    setSearchResult(null); // Clear results when switching modes
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 relative">
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

      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-playfair font-bold text-white mb-2">
            Flight Dashboard
          </h2>
          <p className="text-silver-metallic font-cinzel text-xs uppercase tracking-widest">
            Real-time Tracking System
          </p>
        </motion.div>

        {/* Mode Switcher */}
        <div className="mb-8 flex justify-center">
          <ModeSwitch mode={mode} onChange={handleModeChange} />
        </div>

        {/* Search Input - Conditional based on mode */}
        <div className="mb-12">
          <AnimatePresence mode="wait">
            {mode === "flight-status" ? (
              <motion.div
                key="flight-status"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FlightSearchInput onSearch={handleSearch} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="trip-planning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TripPlanningForm isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading State & Results - Only for Flight Status mode */}
        {mode === "flight-status" && (
          <>
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-2xl border-4 border-amber-electric/20 border-t-amber-electric mb-6"
                  />
                  <p className="text-silver-metallic font-jetbrains text-sm uppercase tracking-wider">
                    Scanning flight data...
                  </p>
                </motion.div>
              )}

              {/* Results */}
              {!isLoading && searchResult && (
                <motion.div key="results">
                  {searchResult && "isMultiFlight" in searchResult ? (
                    <MultiFlightView result={searchResult} />
                  ) : (
                    <FlightTicket result={searchResult as FlightSearchResult} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && !searchResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center py-12"
              >
                <div className="glass-surface rounded-2xl p-8 max-w-xl mx-auto border-dashed border-white/10">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-4"
                  >
                    <Plane className="w-12 h-12 text-silver-metallic/30 mx-auto" />
                  </motion.div>
                  <p className="text-silver-metallic font-jetbrains text-sm">
                    Awaiting flight data input
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

