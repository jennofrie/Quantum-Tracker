// ICAO to IATA aircraft code mapping
// Common commercial aircraft ICAO codes mapped to IATA codes

export const icaoToIataMap: Record<string, string> = {
  // Boeing
  "B738": "B738", // Boeing 737-800
  "B739": "B739", // Boeing 737-900
  "B38M": "B38M", // Boeing 737 MAX 8
  "B39M": "B39M", // Boeing 737 MAX 9
  "B763": "B763", // Boeing 767-300
  "B772": "B772", // Boeing 777-200
  "B77W": "B773", // Boeing 777-300ER (ICAO uses 77W, IATA uses B773)
  "B773": "B773", // Boeing 777-300ER
  "B788": "B788", // Boeing 787-8
  "B789": "B789", // Boeing 787-9
  "B78X": "B78X", // Boeing 787-10
  "B744": "B744", // Boeing 747-400
  "B748": "B748", // Boeing 747-8
  
  // Airbus
  "A319": "A319", // Airbus A319
  "A320": "A320", // Airbus A320
  "A321": "A321", // Airbus A321
  "A20N": "A20N", // Airbus A320neo
  "A21N": "A21N", // Airbus A321neo
  "A332": "A332", // Airbus A330-200
  "A333": "A333", // Airbus A330-300
  "A339": "A339", // Airbus A330-900neo
  "A359": "A359", // Airbus A350-900
  "A35K": "A35K", // Airbus A350-1000
  "A388": "A388", // Airbus A380-800
  
  // Embraer
  "E190": "E190", // Embraer E190
  "E195": "E195", // Embraer E195
  
  // Bombardier
  "DH4": "DH4", // Bombardier Dash 8 Q400
  
  // Airbus A220 (formerly Bombardier CSeries)
  "BCS1": "BCS1", // Airbus A220-100
  "BCS3": "BCS3", // Airbus A220-300
};

/**
 * Convert ICAO aircraft code to IATA code
 * @param icao - ICAO aircraft code (e.g., "B738", "A320")
 * @returns IATA code if mapping exists, null otherwise
 */
export function icaoToIata(icao: string | null | undefined): string | null {
  if (!icao) return null;
  return icaoToIataMap[icao.toUpperCase()] || null;
}

