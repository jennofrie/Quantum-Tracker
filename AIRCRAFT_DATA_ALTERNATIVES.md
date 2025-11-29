# Aircraft Data Alternative Sources

## Current Situation
The Aviation Stack API free tier often doesn't return aircraft data (IATA/ICAO codes) for flights. This is a known limitation.

## Alternative Data Sources

### 1. **OpenSky Network API** (Free)
- **URL**: https://opensky-network.org/apidoc/
- **Pros**: Free, real-time data, includes aircraft registration
- **Cons**: Only covers flights currently in the air or recently landed
- **Best for**: Active flight tracking
- **Registration**: Required (free)

### 2. **AeroDataBox API** (Paid, Free Tier Available)
- **URL**: https://aerodatabox.com/
- **Pros**: Comprehensive aircraft database, good coverage
- **Cons**: Limited free tier, paid plans for production
- **Best for**: Production applications with budget
- **Pricing**: Free tier available, paid plans start at ~$50/month

### 3. **Aviation Edge** (Paid)
- **URL**: https://aviation-edge.com/
- **Pros**: Extensive aircraft database, reliable
- **Cons**: Paid service only
- **Best for**: Commercial applications
- **Pricing**: Starts around $50/month

### 4. **FlightAware AeroAPI** (Paid, Free Tier)
- **URL**: https://flightaware.com/commercial/aeroapi/
- **Pros**: Very comprehensive, includes aircraft details
- **Cons**: Free tier is limited, paid plans required for production
- **Best for**: Professional applications
- **Pricing**: Free tier available, paid plans vary

### 5. **ICAO Aircraft Database** (Official, Limited API)
- **URL**: https://www.icao.int/publications/Pages/doc8643.aspx
- **Pros**: Official source, comprehensive
- **Cons**: Not a direct API, requires data scraping/parsing
- **Best for**: Static aircraft type lookups

## Recommended Approach

### Option 1: Hybrid Solution (Recommended)
1. **Keep Aviation Stack** for flight status/search
2. **Add OpenSky Network** for active flights (when aircraft is in air)
3. **Use local database** (our `aircraft_data.json`) for aircraft type lookups
4. **Fallback**: Show helpful message when data unavailable

### Option 2: Upgrade Aviation Stack
- Upgrade to paid tier ($99+/month)
- Better aircraft data coverage
- Single API integration

### Option 3: Multi-Source Fallback
- Try Aviation Stack first
- If no aircraft data, query OpenSky Network (for active flights)
- If still no data, use route/airline to infer likely aircraft type
- Show best available information

## Implementation Notes

### Using ICAO Codes
The Aviation Stack API may return ICAO codes even when IATA is missing. We could:
1. Map ICAO → IATA codes
2. Use ICAO directly if IATA unavailable
3. Expand `aircraft_data.json` to include ICAO mappings

### Route-Based Inference
For flights without aircraft data, we could:
1. Use route distance to suggest likely aircraft types
2. Use airline's typical fleet for that route
3. Show "Likely aircraft: [type]" based on route analysis

## Current Status
✅ Feature implemented correctly
✅ UI shows helpful message when data unavailable
✅ Ready to integrate additional data sources if needed

## Next Steps
1. **Short-term**: Keep current implementation with improved UI messaging
2. **Medium-term**: Integrate OpenSky Network for active flights
3. **Long-term**: Consider paid API if aircraft data is critical feature

