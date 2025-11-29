"use client";

import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Calendar, MapPin, History } from "lucide-react";
import {
  getFlightHistory,
  FlightHistoryItem,
  saveTripToHistory,
  TripData,
} from "../utils/flightHistory";

interface TripPlanningFormProps {
  isLoading?: boolean;
}

interface ValidationErrors {
  origin?: string;
  destination?: string;
  date?: string;
  arrivalDate?: string;
}

export default function TripPlanningForm({
  isLoading = false,
}: TripPlanningFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [history, setHistory] = useState<FlightHistoryItem[]>([]);

  useEffect(() => {
    // Load only trip-planning history
    const allHistory = getFlightHistory();
    setHistory(allHistory.filter((item) => item.mode === "trip-planning"));
  }, []);

  // Validate IATA code (3 uppercase letters)
  const validateIATA = (code: string): boolean => {
    return /^[A-Z]{3}$/.test(code);
  };

  // Validate date (must be future date)
  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  // Validate arrival date (must be after or equal to departure date)
  const validateArrivalDate = (arrivalDateStr: string, departureDateStr: string): boolean => {
    if (!arrivalDateStr) return true; // Optional field
    if (!departureDateStr) return false;
    const arrivalDateObj = new Date(arrivalDateStr);
    const departureDateObj = new Date(departureDateStr);
    return arrivalDateObj >= departureDateObj;
  };

  // Real-time validation
  const validateField = (field: string, value: string, departureDateOverride?: string) => {
    const newErrors = { ...errors };

    if (field === "origin") {
      if (value && !validateIATA(value)) {
        newErrors.origin = "Must be 3 uppercase letters (e.g., SYD)";
      } else {
        delete newErrors.origin;
      }
    }

    if (field === "destination") {
      if (value && !validateIATA(value)) {
        newErrors.destination = "Must be 3 uppercase letters (e.g., LHR)";
      } else {
        delete newErrors.destination;
      }
    }

    if (field === "date") {
      if (value && !validateDate(value)) {
        newErrors.date = "Must be a future date";
      } else {
        delete newErrors.date;
        // Re-validate arrival date when departure date changes
        if (arrivalDate && !validateArrivalDate(arrivalDate, value)) {
          newErrors.arrivalDate = "Must be on or after departure date";
        } else {
          delete newErrors.arrivalDate;
        }
      }
    }

    if (field === "arrivalDate") {
      const departureToCheck = departureDateOverride || date;
      if (value && !validateArrivalDate(value, departureToCheck)) {
        newErrors.arrivalDate = "Must be on or after departure date";
      } else {
        delete newErrors.arrivalDate;
      }
    }

    setErrors(newErrors);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      validateIATA(origin) &&
      validateIATA(destination) &&
      validateDate(date) &&
      (!arrivalDate || validateArrivalDate(arrivalDate, date)) &&
      Object.keys(errors).length === 0
    );
  };

  const handleLaunchScout = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) return;

    // Save to history
    const tripData: TripData = { origin, destination, date, arrivalDate: arrivalDate || undefined };
    saveTripToHistory(tripData);

    // Generate Google Flights deep link
    let googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights+from+${origin}+to+${destination}+on+${date}`;
    
    // Add return date if provided
    if (arrivalDate) {
      googleFlightsUrl += `+returning+on+${arrivalDate}`;
    }

    // Open in new tab
    window.open(googleFlightsUrl, "_blank", "noopener,noreferrer");

    // Refresh history
    setTimeout(() => {
      const allHistory = getFlightHistory();
      setHistory(allHistory.filter((item) => item.mode === "trip-planning"));
    }, 100);
  };

  const handleHistoryClick = (tripData: TripData) => {
    if (isLoading) return;

    setOrigin(tripData.origin);
    setDestination(tripData.destination);
    setDate(tripData.date);
    setArrivalDate(tripData.arrivalDate || "");

    // Validate all fields
    validateField("origin", tripData.origin);
    validateField("destination", tripData.destination);
    validateField("date", tripData.date);
    if (tripData.arrivalDate) {
      validateField("arrivalDate", tripData.arrivalDate, tripData.date);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Instructions */}
      <div className="mb-4 text-center">
        <p className="text-sm text-silver-metallic font-jetbrains">
          Enter IATA codes (e.g., SYD, LHR) and travel dates for flight pricing.
        </p>
        <p className="text-xs text-silver-metallic/50 font-jetbrains mt-1">
          Return date is optional for one-way trips.
        </p>
      </div>

      <form onSubmit={handleLaunchScout} className="space-y-4">
        <div className="glass-surface rounded-2xl p-6 space-y-4">
          {/* Origin Input */}
          <div>
            <label
              htmlFor="origin-input"
              className="block text-xs font-cinzel text-silver-metallic uppercase tracking-wider mb-2"
            >
              Origin Airport
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-electric/50" />
              <input
                id="origin-input"
                type="text"
                value={origin}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().slice(0, 3);
                  setOrigin(value);
                  validateField("origin", value);
                }}
                onFocus={() => setIsFocused("origin")}
                onBlur={() => setIsFocused(null)}
                placeholder="SYD"
                maxLength={3}
                disabled={isLoading}
                className={`w-full bg-transparent border rounded-xl py-3 pl-12 pr-4 text-xl font-jetbrains text-white placeholder:text-white/30 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.origin
                    ? "border-red-500/50 focus:border-red-500"
                    : isFocused === "origin"
                    ? "border-amber-electric/50"
                    : "border-white/10"
                }`}
              />
            </div>
            {errors.origin && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-jetbrains mt-1 ml-1"
              >
                {errors.origin}
              </motion.p>
            )}
          </div>

          {/* Destination Input */}
          <div>
            <label
              htmlFor="destination-input"
              className="block text-xs font-cinzel text-silver-metallic uppercase tracking-wider mb-2"
            >
              Destination Airport
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-dim/80" />
              <input
                id="destination-input"
                type="text"
                value={destination}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().slice(0, 3);
                  setDestination(value);
                  validateField("destination", value);
                }}
                onFocus={() => setIsFocused("destination")}
                onBlur={() => setIsFocused(null)}
                placeholder="LHR"
                maxLength={3}
                disabled={isLoading}
                className={`w-full bg-transparent border rounded-xl py-3 pl-12 pr-4 text-xl font-jetbrains text-white placeholder:text-white/30 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.destination
                    ? "border-red-500/50 focus:border-red-500"
                    : isFocused === "destination"
                    ? "border-amber-electric/50"
                    : "border-white/10"
                }`}
              />
            </div>
            {errors.destination && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-jetbrains mt-1 ml-1"
              >
                {errors.destination}
              </motion.p>
            )}
          </div>

          {/* Departure Date Input */}
          <div>
            <label
              htmlFor="date-input"
              className="block text-xs font-cinzel text-silver-metallic uppercase tracking-wider mb-2"
            >
              Departure Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-metallic/50 pointer-events-none z-10" />
              <input
                id="date-input"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  validateField("date", e.target.value);
                }}
                onFocus={() => setIsFocused("date")}
                onBlur={() => setIsFocused(null)}
                min={new Date().toISOString().split("T")[0]}
                disabled={isLoading}
                className={`w-full bg-transparent border rounded-xl py-3 pl-12 pr-4 text-xl font-jetbrains text-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed date-input-dark ${
                  errors.date
                    ? "border-red-500/50 focus:border-red-500"
                    : isFocused === "date"
                    ? "border-amber-electric/50"
                    : "border-white/10"
                }`}
                style={{
                  colorScheme: "dark",
                }}
              />
            </div>
            {errors.date && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-jetbrains mt-1 ml-1"
              >
                {errors.date}
              </motion.p>
            )}
          </div>

          {/* Arrival Date Input (Optional) */}
          <div>
            <label
              htmlFor="arrival-date-input"
              className="block text-xs font-cinzel text-silver-metallic uppercase tracking-wider mb-2"
            >
              Return Date <span className="text-white/30">(Optional)</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500/50 pointer-events-none z-10" />
              <input
                id="arrival-date-input"
                type="date"
                value={arrivalDate}
                onChange={(e) => {
                  setArrivalDate(e.target.value);
                  validateField("arrivalDate", e.target.value);
                }}
                onFocus={() => setIsFocused("arrivalDate")}
                onBlur={() => setIsFocused(null)}
                min={date || new Date().toISOString().split("T")[0]}
                disabled={isLoading || !date}
                className={`w-full bg-transparent border rounded-xl py-3 pl-12 pr-4 text-xl font-jetbrains text-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed date-input-dark ${
                  errors.arrivalDate
                    ? "border-red-500/50 focus:border-red-500"
                    : isFocused === "arrivalDate"
                    ? "border-teal-500/50"
                    : "border-white/10"
                }`}
                style={{
                  colorScheme: "dark",
                }}
              />
            </div>
            {errors.arrivalDate && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 font-jetbrains mt-1 ml-1"
              >
                {errors.arrivalDate}
              </motion.p>
            )}
          </div>

          {/* Launch Button */}
          <motion.button
            type="submit"
            disabled={!isFormValid() || isLoading}
            whileHover={isFormValid() ? { scale: 1.02 } : {}}
            whileTap={isFormValid() ? { scale: 0.98 } : {}}
            className="w-full py-4 bg-amber-electric text-abyss font-cinzel font-bold text-lg rounded-xl hover:bg-amber-electric/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            <Rocket className="w-5 h-5" />
            {isLoading ? "Processing..." : "LAUNCH SCOUT"}
          </motion.button>
        </div>
      </form>

      {/* Trip History Tags */}
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
                Recent Trip Searches
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => {
                if (!item.tripData) return null;
                const { origin, destination, date, arrivalDate } = item.tripData;
                
                const departureStr = new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                
                const displayText = arrivalDate
                  ? `${origin} → ${destination} (${departureStr} - ${new Date(arrivalDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })})`
                  : `${origin} → ${destination} (${departureStr})`;

                return (
                  <motion.button
                    key={`${origin}-${destination}-${date}-${arrivalDate || "oneway"}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => handleHistoryClick(item.tripData!)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 border border-silver-metallic/20 rounded-lg font-jetbrains text-xs text-white/70 hover:border-amber-electric/60 hover:text-amber-electric hover:bg-amber-electric/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {displayText}
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

