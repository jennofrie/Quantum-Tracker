"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import { MultiFlightResult } from "../types/aviation";
import FlightTicket from "./FlightTicket";

interface MultiFlightViewProps {
  result: MultiFlightResult;
}

export default function MultiFlightView({ result }: MultiFlightViewProps) {
  const { flights, connectionTime } = result;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Multi-Flight Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-surface rounded-2xl p-6 border-2 border-amber-electric/20"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-electric/10 flex items-center justify-center border border-amber-electric/30">
              <Plane className="w-6 h-6 text-amber-electric" />
            </div>
            <div>
              <h3 className="text-xl font-playfair font-bold text-white">
                Connecting Flights
              </h3>
              <p className="text-silver-metallic font-cinzel text-xs uppercase tracking-wider">
                {flights.length} Flight Journey
              </p>
            </div>
          </div>

          {connectionTime && (
            <div className={`px-4 py-2 rounded-xl border-2 ${
              connectionTime.isShort 
                ? "border-red-500/40 bg-red-500/10" 
                : "border-teal-500/40 bg-teal-500/10"
            }`}>
              <div className="flex items-center gap-2">
                {connectionTime.isShort ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                )}
                <div>
                  <p className="text-[10px] font-cinzel text-silver-metallic uppercase tracking-wider">
                    Layover Time
                  </p>
                  <p className={`text-lg font-jetbrains font-bold ${
                    connectionTime.isShort ? "text-red-400" : "text-teal-400"
                  }`}>
                    {connectionTime.hours}h {connectionTime.minutes}m
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {connectionTime?.isShort && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-jetbrains text-red-400/90">
                <strong>Tight Connection:</strong> Less than 60 minutes between flights. 
                Consider checking airline minimum connection time requirements.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Individual Flight Cards */}
      <div className="space-y-6 relative">
        {flights.map((flight, index) => (
          <div key={index} className="relative">
            {/* Flight Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.2 }}
            >
              <FlightTicket result={flight} />
            </motion.div>

            {/* Connection Indicator */}
            {index < flights.length - 1 && connectionTime && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.2 }}
                className="flex flex-col items-center py-4 relative z-10"
              >
                {/* Vertical Line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-gradient-to-b from-amber-electric via-teal-500 to-amber-electric opacity-30"></div>
                </div>

                {/* Connection Info Card */}
                <div className={`glass-surface px-6 py-3 rounded-xl border-2 ${
                  connectionTime.isShort
                    ? "border-red-500/40 bg-red-500/5"
                    : "border-teal-500/40 bg-teal-500/5"
                } relative z-10`}>
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${
                      connectionTime.isShort ? "text-red-400" : "text-teal-400"
                    }`} />
                    <div>
                      <p className="text-[10px] font-cinzel text-silver-metallic uppercase tracking-wider mb-0.5">
                        Connection Time
                      </p>
                      <p className={`text-base font-jetbrains font-bold ${
                        connectionTime.isShort ? "text-red-400" : "text-teal-400"
                      }`}>
                        {connectionTime.hours}h {connectionTime.minutes}m
                      </p>
                    </div>
                    <ArrowDown className={`w-4 h-4 ${
                      connectionTime.isShort ? "text-red-400" : "text-teal-400"
                    }`} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Show error message if flight failed */}
            {!flight.success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.2 }}
                className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
              >
                <p className="text-sm font-jetbrains text-red-400">
                  <strong>Flight {flight.flightNumber}:</strong> {flight.error}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Journey Summary Footer */}
      {flights.every(f => f.success) && flights.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-surface rounded-2xl p-6 border border-white/10"
        >
          <h4 className="text-sm font-cinzel text-silver-metallic uppercase tracking-wider mb-3">
            Journey Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-1">
                Origin
              </p>
              <p className="font-jetbrains text-white">
                {flights[0].data?.departure.iata} - {flights[0].data?.departure.airport.split(" ")[0]}
              </p>
            </div>
            <div>
              <p className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-1">
                Final Destination
              </p>
              <p className="font-jetbrains text-white">
                {flights[flights.length - 1].data?.arrival.iata} - {flights[flights.length - 1].data?.arrival.airport.split(" ")[0]}
              </p>
            </div>
            <div>
              <p className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-1">
                Total Flights
              </p>
              <p className="font-jetbrains text-white">
                {flights.length} {flights.length === 1 ? "Flight" : "Flights"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

