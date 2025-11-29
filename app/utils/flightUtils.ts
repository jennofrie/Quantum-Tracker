/**
 * Utility functions for flight data processing
 */

/**
 * Check if a flight is likely active (recently scheduled or in progress)
 * Used to determine if OpenSky Network API should be queried
 */
export function isFlightLikelyActive(scheduledTime: string): boolean {
  const scheduled = new Date(scheduledTime);
  const now = new Date();
  const hoursDiff = (now.getTime() - scheduled.getTime()) / (1000 * 60 * 60);
  
  // Consider flight "active" if scheduled within last 24 hours or next 12 hours
  return hoursDiff >= -12 && hoursDiff <= 24;
}


