"use client";

const STORAGE_KEY = "quantum_tracker_flight_history";
const MAX_HISTORY = 3;

export type SearchMode = "flight-status" | "trip-planning";

export interface TripData {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD format (departure date)
  arrivalDate?: string; // YYYY-MM-DD format (optional return date)
}

export interface FlightHistoryItem {
  mode: SearchMode;
  timestamp: number;
  flightNumber?: string; // For flight-status mode
  tripData?: TripData; // For trip-planning mode
}

export const saveFlightToHistory = (flightNumber: string): void => {
  if (typeof window === "undefined") return;

  try {
    const existingHistory = getFlightHistory();
    
    // Remove duplicate if exists
    const filteredHistory = existingHistory.filter(
      (item) => item.mode !== "flight-status" || item.flightNumber !== flightNumber
    );

    // Add new search at the beginning
    const newHistory: FlightHistoryItem[] = [
      { mode: "flight-status" as const, flightNumber, timestamp: Date.now() },
      ...filteredHistory,
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const saveTripToHistory = (tripData: TripData): void => {
  if (typeof window === "undefined") return;

  try {
    const existingHistory = getFlightHistory();
    
    // Remove duplicate if exists (same origin + destination + date)
    const filteredHistory = existingHistory.filter(
      (item) =>
        item.mode !== "trip-planning" ||
        item.tripData?.origin !== tripData.origin ||
        item.tripData?.destination !== tripData.destination ||
        item.tripData?.date !== tripData.date
    );

    // Add new search at the beginning
    const newHistory: FlightHistoryItem[] = [
      { mode: "trip-planning" as const, tripData, timestamp: Date.now() },
      ...filteredHistory,
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFlightHistory = (): FlightHistoryItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history: FlightHistoryItem[] = JSON.parse(stored);
    return history.slice(0, MAX_HISTORY);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const clearFlightHistory = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

