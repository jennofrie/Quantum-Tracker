// Aviation Stack API Response Types

export interface FlightDeparture {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string | null;
  gate: string | null;
  delay: number | null;
  scheduled: string;
  estimated: string;
  actual: string | null;
  estimated_runway: string | null;
  actual_runway: string | null;
}

export interface FlightArrival {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string | null;
  gate: string | null;
  baggage: string | null;
  delay: number | null;
  scheduled: string;
  estimated: string;
  actual: string | null;
  estimated_runway: string | null;
  actual_runway: string | null;
}

export interface FlightData {
  flight_date: string;
  flight_status: string;
  departure: FlightDeparture;
  arrival: FlightArrival;
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: null | {
      airline_name: string;
      airline_iata: string;
      airline_icao: string;
      flight_number: string;
      flight_iata: string;
      flight_icao: string;
    };
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  } | null;
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  } | null;
}

export interface AviationStackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: FlightData[];
}

export interface FlightSearchResult {
  success: boolean;
  data?: {
    flightNumber: string;
    airline: string;
    status: string;
    departure: {
      airport: string;
      iata: string;
      scheduled: string;
      timezone: string;
      terminal: string | null;
      gate: string | null;
    };
    arrival: {
      airport: string;
      iata: string;
      scheduled: string;
      timezone: string;
      terminal: string | null;
      gate: string | null;
    };
    aircraft: {
      registration: string;
      iata: string | null;
      icao?: string | null;
    } | null;
  };
  error?: string;
}

// Weather-related types for OpenWeatherMap API
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherForecastItem {
  dt: number;
  main: WeatherMain;
  weather: WeatherCondition[];
  dt_txt: string;
}

export interface WeatherData {
  success: boolean;
  localTime?: string;
  timezone?: string;
  forecast?: {
    date: string;
    temp: number;
    description: string;
    icon: string;
  }[];
  error?: string;
}

// Multi-flight search types
export interface MultiFlightResult {
  isMultiFlight: true;
  flights: (FlightSearchResult & { flightNumber: string })[];
  connectionTime?: {
    hours: number;
    minutes: number;
    isShort: boolean; // < 60 minutes
  };
}

export type SearchResult = FlightSearchResult | MultiFlightResult;

// Aircraft data source types
export interface AircraftDataSource {
  source: "aviation-stack" | "opensky" | "icao-mapping" | "route-inference";
  iata?: string | null;
  icao?: string | null;
  registration?: string | null;
  callsign?: string | null;
  isEstimated?: boolean;
  confidence?: "high" | "medium" | "low";
  reason?: string;
}

