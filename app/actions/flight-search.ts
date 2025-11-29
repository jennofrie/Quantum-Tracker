"use server";

import { FlightSearchResult, AviationStackResponse } from "../types/aviation";

const API_KEY = process.env.AVIATION_STACK_API_KEY || "";
const API_BASE_URL = "http://api.aviationstack.com/v1/flights";

export async function searchFlight(
  flightIata: string
): Promise<FlightSearchResult> {
  if (!flightIata || flightIata.trim() === "") {
    return {
      success: false,
      error: "Please enter a valid flight number",
    };
  }

  try {
    const url = `${API_BASE_URL}?access_key=${API_KEY}&flight_iata=${flightIata.trim()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          error: "API rate limit reached. Please try again later.",
        };
      }
      return {
        success: false,
        error: `API request failed with status ${response.status}`,
      };
    }

    const apiResponse: AviationStackResponse = await response.json();

    // Check if we have data
    if (!apiResponse.data || apiResponse.data.length === 0) {
      return {
        success: false,
        error: "No flight found with this flight number. Please verify and try again.",
      };
    }

    // Extract the first flight result
    const flight = apiResponse.data[0];

    // Debug: Log aircraft data from API (check terminal for this output)
    console.log("🔍 API Aircraft Data for", flight.flight.iata, ":", {
      hasAircraft: !!flight.aircraft,
      aircraftIATA: flight.aircraft?.iata || "null",
      aircraftICAO: flight.aircraft?.icao || "null",
      aircraftRegistration: flight.aircraft?.registration || "null",
      fullAircraftObject: flight.aircraft,
    });

    // Transform the API data to our result format
    return {
      success: true,
      data: {
        flightNumber: flight.flight.iata,
        airline: flight.airline.name,
        status: flight.flight_status,
        departure: {
          airport: flight.departure.airport,
          iata: flight.departure.iata,
          scheduled: flight.departure.scheduled,
          timezone: flight.departure.timezone,
          terminal: flight.departure.terminal,
          gate: flight.departure.gate,
        },
        arrival: {
          airport: flight.arrival.airport,
          iata: flight.arrival.iata,
          scheduled: flight.arrival.scheduled,
          timezone: flight.arrival.timezone,
          terminal: flight.arrival.terminal,
          gate: flight.arrival.gate,
        },
        aircraft: flight.aircraft
          ? {
              registration: flight.aircraft.registration || "N/A",
              iata: flight.aircraft.iata || null,
              icao: flight.aircraft.icao || null,
            }
          : null,
      },
    };
  } catch (error) {
    console.error("Flight search error:", error);
    return {
      success: false,
      error: error instanceof Error 
        ? `Connection error: ${error.message}` 
        : "An unexpected error occurred. Please try again.",
    };
  }
}

