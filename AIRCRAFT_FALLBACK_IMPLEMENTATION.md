# Aircraft Data Fallback Chain Implementation

## Overview
Implemented a comprehensive 5-step fallback chain to maximize aircraft data coverage, improving from ~0-5% to an estimated 30-50% coverage.

## Fallback Chain Logic

### Step 1: Aviation Stack (Primary Source)
- **When**: Always checked first
- **What**: Uses aircraft data from Aviation Stack API response
- **Returns**: IATA code, ICAO code, registration
- **Coverage**: ~0-5% (free tier limitation)

### Step 2: ICAO → IATA Mapping
- **When**: Aviation Stack returns ICAO but not IATA
- **What**: Maps ICAO aircraft type codes to IATA codes using static mapping
- **Returns**: IATA code (derived from ICAO), ICAO, registration
- **Coverage**: +10-20% improvement
- **Implementation**: `app/utils/icaoToIataMapping.ts`

### Step 3: OpenSky Network (Active Flights)
- **When**: Flight is active or recently scheduled (within 12 hours before/24 hours after)
- **What**: Queries OpenSky Network API for real-time flight data
- **Returns**: Registration (ICAO24), callsign
- **Limitation**: Only works for flights currently in the air
- **Coverage**: +30-40% for active flights
- **Implementation**: `app/actions/opensky-search.ts`
- **Note**: OpenSky provides registration but not aircraft type, so we combine with route inference

### Step 4: Route-Based Inference
- **When**: No aircraft data from previous steps
- **What**: Infers likely aircraft type based on:
  - Route distance (short/medium/long/ultra-long haul)
  - Airline's typical fleet
  - Route characteristics
- **Returns**: Estimated IATA code, confidence level, reasoning
- **Coverage**: Provides estimates for remaining flights
- **Implementation**: `app/utils/routeInference.ts`
- **Labeling**: Clearly marked as "Estimated" with "(likely)" indicator

### Step 5: Final Fallback
- **When**: All previous steps fail
- **What**: Shows helpful message explaining data unavailability
- **User Experience**: Professional message, not an error

## Implementation Files

### New Files Created
1. **`app/utils/icaoToIataMapping.ts`**
   - ICAO to IATA code mapping
   - 30+ common commercial aircraft mappings

2. **`app/utils/routeInference.ts`**
   - Route distance calculation
   - Airline fleet preferences
   - Aircraft type suggestions based on route characteristics

3. **`app/actions/opensky-search.ts`**
   - OpenSky Network API integration
   - Active flight detection
   - Registration lookup

### Modified Files
1. **`app/components/FlightTicket.tsx`**
   - Implemented fallback chain logic
   - Enhanced UI with source badges
   - Loading states
   - Estimated data indicators

2. **`app/types/aviation.ts`**
   - Added `AircraftDataSource` interface
   - Extended aircraft types with ICAO support

## UI Features

### Source Badges
Each aircraft data source is clearly labeled:
- **Aviation Stack**: Teal badge (primary source)
- **OpenSky Network**: Blue badge (real-time data)
- **ICAO Mapping**: Purple badge (derived data)
- **Route Inference**: Amber badge (estimated data)

### Estimated Data Indicators
- Route inference results show "(Estimated)" label
- Confidence levels displayed (high/medium/low)
- Reasoning shown for transparency

### Loading States
- Shows "Searching for aircraft data..." while fallback chain executes
- Prevents UI flicker during async operations

## Expected Coverage

| Flight Status | Coverage Estimate |
|--------------|-------------------|
| Active flights | 40-50% (OpenSky + Route inference) |
| Scheduled flights (near future) | 20-30% (ICAO mapping + Route inference) |
| Scheduled flights (far future) | 10-20% (Route inference only) |
| **Overall** | **30-40% with real data, 50-60% with estimates** |

## API Requirements

### OpenSky Network
- **Cost**: Free (registration required)
- **Rate Limits**: 
  - Anonymous: 400 requests/day
  - Registered: 1,000 requests/day
- **Registration**: https://opensky-network.org/
- **Note**: No API key needed for basic usage, but registration recommended

### Current Status
- ✅ OpenSky integration ready (no API key needed for basic usage)
- ✅ Works without registration (limited rate)
- ⚠️ For production, consider registering for higher rate limits

## Testing

### Test Cases
1. **Active Flight**: Search for flight currently in the air → Should use OpenSky
2. **Scheduled Flight with ICAO**: Search flight where API returns ICAO → Should use ICAO mapping
3. **Future Flight**: Search flight far in future → Should use route inference
4. **No Data**: Search flight with no data → Should show helpful message

### Expected Behavior
- Fallback chain executes automatically
- Source badge shows data origin
- Estimated data clearly labeled
- No errors, graceful degradation

## Future Enhancements

### Potential Improvements
1. **OpenSky Registration**: Register for higher rate limits
2. **Expand ICAO Mapping**: Add more aircraft type mappings
3. **Enhanced Route Inference**: Add more airline fleet data
4. **Caching**: Cache OpenSky results to reduce API calls
5. **Hybrid Display**: Combine OpenSky registration with route inference aircraft type

## Notes

- OpenSky Network is free and doesn't require payment
- Registration is optional but recommended for production
- Route inference provides estimates, not actual data
- All sources are clearly labeled for transparency
- System gracefully handles API failures

