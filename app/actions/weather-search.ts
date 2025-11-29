"use server";

import { WeatherData, WeatherForecastItem } from "../types/aviation";

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || "";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Map IATA airport codes to city names/coordinates for OpenWeatherMap
// This is a simplified mapping - in production, you'd use a complete airport database
const AIRPORT_CITY_MAP: Record<string, string> = {
  JFK: "New York",
  LAX: "Los Angeles",
  LHR: "London",
  CDG: "Paris",
  DXB: "Dubai",
  SIN: "Singapore",
  HND: "Tokyo",
  SYD: "Sydney",
  FRA: "Frankfurt",
  AMS: "Amsterdam",
  MAD: "Madrid",
  BCN: "Barcelona",
  FCO: "Rome",
  MXP: "Milan",
  ZRH: "Zurich",
  VIE: "Vienna",
  BKK: "Bangkok",
  HKG: "Hong Kong",
  ICN: "Seoul",
  PVG: "Shanghai",
  PEK: "Beijing",
  DEL: "New Delhi",
  BOM: "Mumbai",
  MEL: "Melbourne",
  BNE: "Brisbane",
  AKL: "Auckland",
  YYZ: "Toronto",
  YVR: "Vancouver",
  MEX: "Mexico City",
  GRU: "Sao Paulo",
  EZE: "Buenos Aires",
  JNB: "Johannesburg",
  CAI: "Cairo",
  IST: "Istanbul",
  ATH: "Athens",
  ORD: "Chicago",
  DFW: "Dallas",
  DEN: "Denver",
  SFO: "San Francisco",
  SEA: "Seattle",
  MIA: "Miami",
  ATL: "Atlanta",
  BOS: "Boston",
  LAS: "Las Vegas",
  PHX: "Phoenix",
  IAH: "Houston",
  MCO: "Orlando",
  // Add more as needed
};

export async function getDestinationWeather(
  arrivalIata: string,
  timezone: string
): Promise<WeatherData> {
  if (!API_KEY) {
    console.error("OPENWEATHERMAP_API_KEY is not set");
    return {
      success: false,
      error: "Weather API key not configured. Please set OPENWEATHERMAP_API_KEY in environment variables.",
    };
  }

  try {
    // Get city name from IATA code
    const cityName = AIRPORT_CITY_MAP[arrivalIata];
    
    if (!cityName) {
      console.warn(`Airport ${arrivalIata} not found in city mapping`);
      return {
        success: false,
        error: `Weather data not available for airport ${arrivalIata}. Airport may not be in the mapping database.`,
      };
    }

    // Fetch 5-day forecast from OpenWeatherMap
    const url = `${API_BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=imperial`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Invalid weather API key",
        };
      }
      return {
        success: false,
        error: `Weather API request failed with status ${response.status}`,
      };
    }

    const apiResponse = await response.json();

    if (!apiResponse.list || apiResponse.list.length === 0) {
      return {
        success: false,
        error: "No weather data available",
      };
    }

    // Calculate local time at destination
    const timezoneOffset = apiResponse.city.timezone; // Offset in seconds
    const localTime = new Date(Date.now() + timezoneOffset * 1000)
      .toISOString()
      .slice(11, 16); // Format as HH:MM

    // Process forecast data - get one forecast per day (around noon)
    const dailyForecasts: { date: string; temp: number; description: string; icon: string }[] = [];
    const processedDates = new Set<string>();

    for (const item of apiResponse.list as WeatherForecastItem[]) {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const hour = date.getUTCHours();

      // Get forecast around noon (12:00) for each day
      if (!processedDates.has(dateStr) && hour >= 11 && hour <= 13) {
        processedDates.add(dateStr);
        dailyForecasts.push({
          date: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });

        if (dailyForecasts.length >= 5) break;
      }
    }

    return {
      success: true,
      localTime,
      timezone,
      forecast: dailyForecasts,
    };
  } catch (error) {
    console.error("Weather search error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Weather service error: ${error.message}`
          : "An unexpected error occurred fetching weather data",
    };
  }
}

