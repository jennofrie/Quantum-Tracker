"use client";

import { motion } from "framer-motion";
import {
  Plane,
  MapPin,
  Clock,
  Calendar,
  Navigation,
  Info,
  CircleDot,
  ExternalLink,
  Gauge,
  Ruler,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudDrizzle,
} from "lucide-react";
import { FlightSearchResult, WeatherData, AircraftDataSource } from "../types/aviation";
import aircraftData from "../data/aircraft_data.json";
import { getDestinationWeather } from "../actions/weather-search";
import { searchOpenSkyAircraft } from "../actions/opensky-search";
import { isFlightLikelyActive } from "../utils/flightUtils";
import { icaoToIata } from "../utils/icaoToIataMapping";
import { inferAircraftFromRoute } from "../utils/routeInference";
import { useState, useEffect } from "react";

interface FlightTicketProps {
  result: FlightSearchResult;
}

export default function FlightTicket({ result }: FlightTicketProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aircraftDataSource, setAircraftDataSource] = useState<AircraftDataSource | null>(null);
  const [isLoadingAircraft, setIsLoadingAircraft] = useState(false);

  // Fetch weather data for arrival destination
  useEffect(() => {
    if (result.success && result.data) {
      const fetchWeather = async () => {
        const weather = await getDestinationWeather(
          result.data!.arrival.iata,
          result.data!.arrival.timezone
        );
        setWeatherData(weather);
      };
      fetchWeather();
    }
  }, [result]);

  // Fallback chain for aircraft data
  useEffect(() => {
    if (!result.success || !result.data) return;

    const flightData = result.data; // Store for TypeScript narrowing

    const fetchAircraftData = async () => {
      setIsLoadingAircraft(true);
      
      // Step 1: Try Aviation Stack (already in flightData.aircraft)
      if (flightData.aircraft && flightData.aircraft.iata) {
        setAircraftDataSource({
          source: "aviation-stack",
          iata: flightData.aircraft.iata,
          icao: flightData.aircraft.icao || null,
          registration: flightData.aircraft.registration || null,
        });
        setIsLoadingAircraft(false);
        return;
      }

      // Step 2: Try ICAO mapping (if we have ICAO from Aviation Stack but no IATA)
      if (flightData.aircraft && flightData.aircraft.icao && !flightData.aircraft.iata) {
        const mappedIata = icaoToIata(flightData.aircraft.icao);
        if (mappedIata) {
          setAircraftDataSource({
            source: "icao-mapping",
            iata: mappedIata,
            icao: flightData.aircraft.icao,
            registration: flightData.aircraft.registration || null,
          });
          setIsLoadingAircraft(false);
          return;
        }
      }

      // Step 3: Try OpenSky for active flights (get registration)
      let openskyRegistration = null;
      if (isFlightLikelyActive(flightData.departure.scheduled)) {
        try {
          const openskyData = await searchOpenSkyAircraft(flightData.flightNumber);
          if (openskyData.success && openskyData.icao24) {
            openskyRegistration = openskyData.icao24;
          }
        } catch (error) {
          console.error("OpenSky search failed:", error);
        }
      }

      // Step 4: Route-based inference (for aircraft type)
      const routeInference = inferAircraftFromRoute({
        origin: flightData.departure.iata,
        destination: flightData.arrival.iata,
        airline: flightData.airline,
      });

      if (routeInference) {
        setAircraftDataSource({
          source: "route-inference",
          iata: routeInference.iata,
          registration: openskyRegistration || flightData.aircraft?.registration || null,
          isEstimated: true,
          confidence: routeInference.confidence,
          reason: routeInference.reason,
        });
        setIsLoadingAircraft(false);
        return;
      }

      // If we have OpenSky registration but no route inference, show what we have
      if (openskyRegistration) {
        setAircraftDataSource({
          source: "opensky",
          registration: openskyRegistration,
          callsign: flightData.flightNumber,
        });
        setIsLoadingAircraft(false);
        return;
      }

      // Step 5: Final fallback - no data available
      setAircraftDataSource(null);
      setIsLoadingAircraft(false);
    };

    fetchAircraftData();
  }, [result]);

  // Helper function to get weather icon
  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes("01")) return Sun;
    if (iconCode.includes("09") || iconCode.includes("10")) return CloudRain;
    if (iconCode.includes("13")) return CloudSnow;
    if (iconCode.includes("11")) return CloudRain; // Thunderstorm
    if (iconCode.includes("50")) return CloudDrizzle; // Mist
    return Cloud;
  };

  if (!result.success || !result.data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="glass-surface rounded-3xl p-8 border-2 border-red-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <Info className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-2xl font-playfair font-bold text-red-400">
                Flight Not Found
              </h3>
              <p className="text-silver-metallic font-jetbrains text-sm mt-1">
                Unable to locate flight data
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-red-500/5 rounded-xl border border-red-500/20">
            <p className="text-white/80 font-jetbrains text-sm leading-relaxed">
              {result.error}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const { data } = result;

  // Format date and time
  const formatDateTime = (dateString: string, timezone: string) => {
    const date = new Date(dateString);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return { time: timeStr, date: dateStr, timezone };
  };

  const departure = formatDateTime(
    data.departure.scheduled,
    data.departure.timezone
  );
  const arrival = formatDateTime(data.arrival.scheduled, data.arrival.timezone);

  // Calculate flight progress percentage
  const calculateFlightProgress = (): number => {
    const now = new Date().getTime();
    const departTime = new Date(data.departure.scheduled).getTime();
    const arriveTime = new Date(data.arrival.scheduled).getTime();

    // If flight hasn't departed yet
    if (now < departTime) return 0;
    
    // If flight has landed
    if (now > arriveTime) return 100;

    // Calculate percentage in progress
    const totalDuration = arriveTime - departTime;
    const elapsed = now - departTime;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const flightProgress = calculateFlightProgress();

  // Calculate flight duration
  const calculateDuration = (): string => {
    const departTime = new Date(data.departure.scheduled).getTime();
    const arriveTime = new Date(data.arrival.scheduled).getTime();
    const durationMs = arriveTime - departTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const duration = calculateDuration();

  // Enhanced status color and styling
  const getStatusStyling = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("landed")) {
      return {
        textColor: "text-emerald-500",
        borderColor: "border-emerald-500/40",
        bgColor: "bg-emerald-500/10",
        shouldPulse: false,
      };
    }
    
    if (statusLower.includes("cancelled") || statusLower.includes("incident")) {
      return {
        textColor: "text-red-500",
        borderColor: "border-red-500/40",
        bgColor: "bg-red-500/10",
        shouldPulse: false,
      };
    }
    
    if (statusLower.includes("active")) {
      return {
        textColor: "text-amber-electric",
        borderColor: "border-amber-electric/40",
        bgColor: "bg-amber-electric/10",
        shouldPulse: true,
      };
    }
    
    // Default: scheduled
    return {
      textColor: "text-amber-electric",
      borderColor: "border-amber-electric/40",
      bgColor: "bg-amber-electric/10",
      shouldPulse: false,
    };
  };

  const statusStyle = getStatusStyling(data.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="glass-surface rounded-3xl overflow-hidden border-2 border-amber-electric/20 relative">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-electric/10 via-transparent to-amber-electric/10 p-6 border-b border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -45 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-amber-electric/20 flex items-center justify-center border border-amber-electric/40"
              >
                <Plane className="w-8 h-8 text-amber-electric" />
              </motion.div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-white">
                  {data.flightNumber}
                </h2>
                <p className="text-silver-metallic font-cinzel text-sm uppercase tracking-wider mt-1">
                  {data.airline}
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
              }}
              transition={{ delay: 0.3 }}
              className={`px-6 py-3 rounded-xl border-2 ${statusStyle.textColor} ${statusStyle.borderColor} ${statusStyle.bgColor} font-jetbrains font-semibold uppercase text-sm tracking-wider relative overflow-hidden ${
                statusStyle.shouldPulse ? "animate-pulse-subtle" : ""
              }`}
            >
              {data.status}
              {statusStyle.shouldPulse && (
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-amber-electric/10 blur-xl -z-10"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Flight Route Section */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Departure */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <CircleDot className="w-5 h-5 text-amber-electric flex-shrink-0" />
                <h3 className="text-xs font-cinzel text-silver-metallic uppercase tracking-wider">
                  Departure
                </h3>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-jetbrains font-bold text-white">
                    {data.departure.iata}
                  </span>
                </div>
                <p className="text-lg font-playfair text-white/80 mt-2 leading-tight">
                  {data.departure.airport}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-amber-electric" />
                  <span className="font-jetbrains text-white">
                    {departure.time}
                  </span>
                  <span className="text-silver-metallic text-xs">
                    ({departure.timezone})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-amber-electric" />
                  <span className="font-jetbrains text-white/80">
                    {departure.date}
                  </span>
                </div>
                {(data.departure.terminal || data.departure.gate) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-amber-electric" />
                    <span className="font-jetbrains text-white/80">
                      {data.departure.terminal && `Terminal ${data.departure.terminal}`}
                      {data.departure.terminal && data.departure.gate && " • "}
                      {data.departure.gate && `Gate ${data.departure.gate}`}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Flight Path Visualization with Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col justify-center items-center py-8 lg:py-0 space-y-4"
            >
              {/* Progress Bar */}
              <div className="relative w-full max-w-xs">
                {/* Background track */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  {/* Progress fill */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${flightProgress}%` }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="h-full bg-amber-electric rounded-full relative"
                  >
                    {/* Animated shimmer on progress bar */}
                    {flightProgress > 0 && flightProgress < 100 && (
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                    )}
                  </motion.div>
                </div>

                {/* Plane icon on progress bar */}
                {flightProgress > 0 && flightProgress < 100 && (
                  <motion.div
                    initial={{ left: "0%" }}
                    animate={{ left: `${flightProgress}%` }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  >
                    <motion.div
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Navigation className="w-5 h-5 text-amber-electric rotate-90 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Flight Duration */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="text-xs font-cinzel text-silver-metallic/50 uppercase tracking-wider mb-1">
                  Duration
                </div>
                <div className="text-lg font-jetbrains font-semibold text-amber-electric">
                  {duration}
                </div>
                <div className="text-xs font-jetbrains text-white/40 mt-1">
                  {flightProgress.toFixed(0)}% Complete
                </div>
              </motion.div>
            </motion.div>

            {/* Arrival */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-electric flex-shrink-0" />
                <h3 className="text-xs font-cinzel text-silver-metallic uppercase tracking-wider">
                  Arrival
                </h3>
              </div>

              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-jetbrains font-bold text-white">
                    {data.arrival.iata}
                  </span>
                </div>
                <p className="text-lg font-playfair text-white/80 mt-2 leading-tight">
                  {data.arrival.airport}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-amber-electric" />
                  <span className="font-jetbrains text-white">
                    {arrival.time}
                  </span>
                  <span className="text-silver-metallic text-xs">
                    ({arrival.timezone})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-amber-electric" />
                  <span className="font-jetbrains text-white/80">
                    {arrival.date}
                  </span>
                </div>
                {(data.arrival.terminal || data.arrival.gate) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-amber-electric" />
                    <span className="font-jetbrains text-white/80">
                      {data.arrival.terminal && `Terminal ${data.arrival.terminal}`}
                      {data.arrival.terminal && data.arrival.gate && " • "}
                      {data.arrival.gate && `Gate ${data.arrival.gate}`}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Destination Intelligence Section */}
        {weatherData?.success && weatherData.forecast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-6 sm:px-8 py-6 border-t border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-4 h-4 text-teal-500" />
              <h4 className="text-xs font-cinzel text-silver-metallic/80 uppercase tracking-wider">
                Destination Intelligence
              </h4>
            </div>

            {/* Local Time Display */}
            <div className="mb-6 p-4 glass-surface rounded-xl border border-teal-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-1">
                    Current Local Time
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <span className="text-2xl font-jetbrains font-bold text-white">
                      {weatherData.localTime}
                    </span>
                    <span className="text-sm font-jetbrains text-silver-metallic">
                      ({data.arrival.timezone})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-1">
                    At {data.arrival.iata}
                  </p>
                  <p className="text-sm font-playfair text-white/70">
                    {data.arrival.airport.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div>
              <p className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-3">
                5-Day Forecast
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {weatherData.forecast.map((day, index) => {
                  const WeatherIcon = getWeatherIcon(day.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="glass-surface p-3 rounded-xl border border-white/5 hover:border-teal-500/30 transition-colors"
                    >
                      <p className="text-[10px] font-cinzel text-silver-metallic/60 uppercase tracking-wider mb-2">
                        {day.date}
                      </p>
                      <div className="flex items-center justify-center mb-2">
                        <WeatherIcon className="w-8 h-8 text-teal-500" />
                      </div>
                      <p className="text-xl font-jetbrains font-bold text-white text-center mb-1">
                        {day.temp}°F
                      </p>
                      <p className="text-[9px] font-jetbrains text-white/60 text-center capitalize leading-tight">
                        {day.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer with Aircraft Tech Specs - Fallback Chain Implementation */}
        {(() => {
          // Show loading state while fetching aircraft data
          if (isLoadingAircraft) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="px-6 sm:px-8 py-4 bg-white/5 border-t border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-4 h-4 text-amber-electric/60" />
                  <h4 className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider">
                    Aircraft Specifications
                  </h4>
                </div>
                <p className="text-xs font-jetbrains text-white/40 italic">
                  Searching for aircraft data...
                </p>
              </motion.div>
            );
          }

          // Step 5: Final fallback - no data available
          if (!aircraftDataSource) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="px-6 sm:px-8 py-4 bg-white/5 border-t border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Plane className="w-4 h-4 text-amber-electric/60" />
                  <h4 className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider">
                    Aircraft Specifications
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-amber-electric/5 border border-amber-electric/20 rounded-lg">
                    <Info className="w-4 h-4 text-amber-electric/60 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-jetbrains text-white/60 mb-1">
                        <strong className="text-amber-electric/80">Aircraft Data Unavailable:</strong>
                      </p>
                      <p className="text-[10px] font-jetbrains text-white/40 leading-relaxed">
                        Aircraft information could not be found from available data sources. 
                        This may occur for scheduled flights far in the future or flights not currently tracked.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          // Get aircraft info from database if we have IATA code
          const aircraftInfo = aircraftDataSource.iata
            ? aircraftData[aircraftDataSource.iata as keyof typeof aircraftData]
            : null;

          // Determine source badge color and text
          const getSourceBadge = () => {
            switch (aircraftDataSource.source) {
              case "aviation-stack":
                return { text: "Aviation Stack", color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" };
              case "opensky":
                return { text: "OpenSky Network", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
              case "icao-mapping":
                return { text: "ICAO Mapping", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
              case "route-inference":
                return { text: "Route Inference", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
              default:
                return { text: "Unknown", color: "text-white/40", bg: "bg-white/5", border: "border-white/10" };
            }
          };

          const sourceBadge = getSourceBadge();

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="px-6 sm:px-8 py-4 bg-white/5 border-t border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-amber-electric/60" />
                  <h4 className="text-xs font-cinzel text-silver-metallic/60 uppercase tracking-wider">
                    Aircraft Specifications
                  </h4>
                  {aircraftDataSource.isEstimated && (
                    <span className="text-[9px] font-jetbrains text-amber-400/60 italic">
                      (Estimated)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-jetbrains px-2 py-1 rounded ${sourceBadge.bg} ${sourceBadge.border} border ${sourceBadge.color}`}>
                    {sourceBadge.text}
                  </span>
                  {aircraftInfo?.seatMapUrl && (
                    <a
                      href={aircraftInfo.seatMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-jetbrains text-amber-electric hover:text-amber-electric/80 transition-colors group"
                    >
                      <span>View Seat Map</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm opacity-80">
                <div className="space-y-1">
                  <span className="text-silver-metallic/60 font-cinzel uppercase tracking-wider text-xs block">
                    Model
                  </span>
                  <span className="font-jetbrains text-white/80 block">
                    {aircraftInfo?.model || aircraftDataSource.iata || "N/A"}
                    {aircraftDataSource.isEstimated && (
                      <span className="text-amber-400/60 text-xs ml-1">(likely)</span>
                    )}
                  </span>
                  {aircraftDataSource.reason && (
                    <span className="text-[9px] font-jetbrains text-white/30 italic block mt-1">
                      {aircraftDataSource.reason}
                    </span>
                  )}
                </div>
                
                {aircraftDataSource.registration && aircraftDataSource.registration !== "N/A" && (
                  <div className="space-y-1">
                    <span className="text-silver-metallic/60 font-cinzel uppercase tracking-wider text-xs block">
                      Registration
                    </span>
                    <span className="font-jetbrains text-white/70 block">
                      {aircraftDataSource.registration}
                    </span>
                  </div>
                )}
                
                {aircraftDataSource.icao && (
                  <div className="space-y-1">
                    <span className="text-silver-metallic/60 font-cinzel uppercase tracking-wider text-xs block">
                      ICAO Code
                    </span>
                    <span className="font-jetbrains text-white/70 block">
                      {aircraftDataSource.icao}
                    </span>
                  </div>
                )}
                
                {aircraftInfo && (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3 h-3 text-silver-metallic/60" />
                        <span className="text-silver-metallic/60 font-cinzel uppercase tracking-wider text-xs">
                          Range
                        </span>
                      </div>
                      <span className="font-jetbrains text-white/70 block">
                        {aircraftInfo.range.toLocaleString()} mi
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-silver-metallic/60" />
                        <span className="text-silver-metallic/60 font-cinzel uppercase tracking-wider text-xs">
                          Cruise Speed
                        </span>
                      </div>
                      <span className="font-jetbrains text-white/70 block">
                        {aircraftInfo.cruiseSpeed} mph
                      </span>
                    </div>
                  </>
                )}
                
                {!aircraftInfo && aircraftDataSource.iata && (
                  <div className="space-y-1 col-span-2">
                    <span className="text-silver-metallic/40 font-jetbrains text-xs italic">
                      Detailed specifications not available for {aircraftDataSource.iata}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-electric/5 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-dim/30 blur-3xl rounded-full -z-10"></div>
      </div>
    </motion.div>
  );
}

