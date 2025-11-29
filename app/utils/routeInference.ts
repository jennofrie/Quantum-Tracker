// Route-based aircraft type inference
// Suggests likely aircraft types based on route distance and airline

interface RouteInfo {
  origin: string;
  destination: string;
  airline: string;
  distance?: number; // in miles
}

interface AircraftSuggestion {
  iata: string;
  model: string;
  confidence: "high" | "medium" | "low";
  reason: string;
}

// Calculate approximate distance between airports (simplified)
// In production, you'd use a proper distance calculation library
function estimateDistance(origin: string, destination: string): number {
  // Major route distances (miles) - simplified lookup
  const routeDistances: Record<string, number> = {
    "JFK-LHR": 3459,
    "JFK-LAX": 2475,
    "LAX-SYD": 7488,
    "LHR-SIN": 6768,
    "SIN-SYD": 3907,
    "FRA-SIN": 6317,
    "DXB-LHR": 3420,
    "JFK-DXB": 6840,
    "LHR-DXB": 3420,
  };
  
  const route = `${origin}-${destination}`;
  const reverseRoute = `${destination}-${origin}`;
  
  return routeDistances[route] || routeDistances[reverseRoute] || 0;
}

// Airline fleet preferences (typical aircraft for routes)
const airlineFleets: Record<string, string[]> = {
  "American Airlines": ["B738", "B772", "B773", "B788", "B789"],
  "United Airlines": ["B738", "B772", "B773", "B788", "B789", "A320"],
  "Delta Air Lines": ["B738", "B763", "A320", "A321", "A332", "A333"],
  "British Airways": ["A320", "A321", "B772", "B773", "B788", "B789", "A388"],
  "Singapore Airlines": ["A350", "A359", "A35K", "B773", "B77W", "A388"],
  "Emirates": ["A380", "A388", "B773", "B77W", "A350", "A359"],
  "Lufthansa": ["A320", "A321", "A332", "A333", "A350", "A359", "B748"],
  "Qantas": ["B738", "B789", "A332", "A333", "A388"],
  "Air France": ["A320", "A321", "A332", "A333", "A350", "A359", "B777"],
  "Japan Airlines": ["B738", "B773", "B77W", "B788", "B789"],
};

/**
 * Infer likely aircraft type based on route and airline
 */
export function inferAircraftFromRoute(route: RouteInfo): AircraftSuggestion | null {
  const distance = route.distance || estimateDistance(route.origin, route.destination);
  const airline = route.airline;
  
  // Get airline's typical fleet
  const fleet = airlineFleets[airline] || [];
  
  // Route-based suggestions
  let suggestions: AircraftSuggestion[] = [];
  
  // Short haul (< 1000 miles)
  if (distance > 0 && distance < 1000) {
    suggestions = [
      { iata: "B738", model: "Boeing 737-800", confidence: "high", reason: "Short-haul route" },
      { iata: "A320", model: "Airbus A320", confidence: "high", reason: "Short-haul route" },
      { iata: "A321", model: "Airbus A321", confidence: "medium", reason: "Short-haul route" },
    ];
  }
  // Medium haul (1000-3000 miles)
  else if (distance >= 1000 && distance < 3000) {
    suggestions = [
      { iata: "B738", model: "Boeing 737-800", confidence: "medium", reason: "Medium-haul route" },
      { iata: "B789", model: "Boeing 787-9", confidence: "medium", reason: "Medium-haul route" },
      { iata: "A321", model: "Airbus A321", confidence: "medium", reason: "Medium-haul route" },
      { iata: "A332", model: "Airbus A330-200", confidence: "low", reason: "Medium-haul route" },
    ];
  }
  // Long haul (3000-6000 miles)
  else if (distance >= 3000 && distance < 6000) {
    suggestions = [
      { iata: "B789", model: "Boeing 787-9", confidence: "high", reason: "Long-haul route" },
      { iata: "B773", model: "Boeing 777-300ER", confidence: "high", reason: "Long-haul route" },
      { iata: "A359", model: "Airbus A350-900", confidence: "high", reason: "Long-haul route" },
      { iata: "A332", model: "Airbus A330-200", confidence: "medium", reason: "Long-haul route" },
    ];
  }
  // Ultra long haul (> 6000 miles)
  else if (distance >= 6000) {
    suggestions = [
      { iata: "B789", model: "Boeing 787-9", confidence: "high", reason: "Ultra long-haul route" },
      { iata: "B773", model: "Boeing 777-300ER", confidence: "high", reason: "Ultra long-haul route" },
      { iata: "A359", model: "Airbus A350-900", confidence: "high", reason: "Ultra long-haul route" },
      { iata: "A388", model: "Airbus A380-800", confidence: "medium", reason: "Ultra long-haul route" },
    ];
  }
  
  // If no distance, use airline fleet
  if (suggestions.length === 0 && fleet.length > 0) {
    const firstAircraft = fleet[0];
    // Use a generic model name format
    const modelName = firstAircraft.startsWith("B") 
      ? `Boeing ${firstAircraft.slice(1)}`
      : firstAircraft.startsWith("A")
      ? `Airbus ${firstAircraft.slice(1)}`
      : firstAircraft;
    
    suggestions = [
      { 
        iata: firstAircraft, 
        model: modelName, 
        confidence: "low", 
        reason: `Based on ${airline} typical fleet` 
      },
    ];
  }
  
  // Filter by airline fleet if available
  if (fleet.length > 0) {
    const fleetMatches = suggestions.filter(s => fleet.includes(s.iata));
    if (fleetMatches.length > 0) {
      return fleetMatches[0]; // Return highest confidence match
    }
  }
  
  // Return first suggestion if available
  return suggestions.length > 0 ? suggestions[0] : null;
}

