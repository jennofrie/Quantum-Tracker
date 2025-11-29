"use server";

// OpenSky Network API integration for active flights
// Documentation: https://opensky-network.org/apidoc/

interface OpenSkyState {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
}

interface OpenSkyResponse {
  time: number;
  states: (OpenSkyState | null)[];
}

interface OpenSkyAircraftData {
  success: boolean;
  registration?: string;
  icao24?: string;
  callsign?: string;
  error?: string;
}

/**
 * Search OpenSky Network for aircraft data by flight callsign
 * Note: OpenSky only has data for flights currently in the air or recently landed
 */
export async function searchOpenSkyAircraft(
  flightNumber: string
): Promise<OpenSkyAircraftData> {
  try {
    // OpenSky Network API endpoint
    const url = "https://opensky-network.org/api/states/all";
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        error: `OpenSky API request failed with status ${response.status}`,
      };
    }

    const data: OpenSkyResponse = await response.json();

    if (!data.states || data.states.length === 0) {
      return {
        success: false,
        error: "No active flights found in OpenSky Network",
      };
    }

    // Search for flight by callsign (flight number)
    // OpenSky uses callsign format like "UAL123" or "BAW123"
    const normalizedFlightNumber = flightNumber.toUpperCase().trim();
    
    // Try exact match first
    let matchingState = data.states.find(
      (state) =>
        state &&
        state.callsign &&
        state.callsign.trim().toUpperCase() === normalizedFlightNumber
    );

    // If no exact match, try partial match (some callsigns have airline prefix)
    if (!matchingState) {
      matchingState = data.states.find(
        (state) =>
          state &&
          state.callsign &&
          state.callsign.trim().toUpperCase().includes(normalizedFlightNumber)
      );
    }

    if (!matchingState || !matchingState.icao24) {
      return {
        success: false,
        error: "Flight not found in active flights",
      };
    }

    // Note: OpenSky returns ICAO24 (aircraft registration identifier)
    // This is different from ICAO aircraft type code, but we can use it
    return {
      success: true,
      registration: matchingState.icao24, // ICAO24 identifier
      icao24: matchingState.icao24,
      callsign: matchingState.callsign || undefined,
    };
  } catch (error) {
    console.error("OpenSky search error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `OpenSky service error: ${error.message}`
          : "An unexpected error occurred fetching OpenSky data",
    };
  }
}


