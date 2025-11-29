# Quantum Tracker - Flight Lookup Application

A sophisticated Next.js flight tracking application with an industrial luxury aesthetic, featuring real-time flight data from Aviation Stack API.

## 🎨 Design Philosophy: "Quantum Tracker"

Dark, atmospheric industrial vibe mixed with luxury travel aesthetics:
- **Typography**: Cinzel/Playfair Display for elegance, JetBrains Mono for data
- **Color Palette**: Deep Abyss Blue background, glass morphism surfaces, Electric Amber accents
- **Animations**: Framer Motion with spring physics and scanning effects

## 🚀 Features

### Core Functionality
- **Secure API Handling**: Server-side fetching via Next.js Server Actions (no CORS issues)
- **Real-time Flight Data**: Track flights using IATA codes
- **Elegant Error Handling**: Stylized error messages for API failures and invalid flights
- **Responsive Design**: Optimized for mobile and desktop
- **Advanced Animations**: Staggered fade-ins, spring physics, and scanning light effects
- **Type-Safe**: Full TypeScript implementation with no `any` types

### Enhanced Features
- **🏷️ Flight History**: Last 3 searches saved to localStorage with clickable "luggage tag" style buttons
- **📊 Progress Bar**: Visual flight progress indicator based on real-time calculation (0% future, 100% landed)
- **🎨 Smart Status Colors**: 
  - Gold (#F59E0B) for active/scheduled flights with pulse animation
  - Emerald Green (#10B981) for landed flights
  - Crimson Red (#EF4444) for cancelled/incident flights
- **⏱️ Flight Duration**: Automatic calculation and display of flight time
- **✈️ Tech Specs Footer**: Low-opacity aircraft details section with registration and model info
- **🛡️ Defensive Rendering**: Gracefully hides missing data sections instead of crashing

### New Features (2024)
- **✈️ Aircraft Details & Configuration**: Enhanced aircraft information with model names, specifications (range, cruise speed), and direct links to SeatGuru seat maps for 30+ popular aircraft models
  - **Smart Fallback Chain**: 5-step system maximizes aircraft data coverage (30-50% vs 0-5% before)
    - Aviation Stack API (primary)
    - ICAO → IATA mapping (when ICAO available)
    - OpenSky Network (for active flights)
    - Route-based inference (estimated aircraft types)
    - Graceful fallback messaging
- **🌤️ Destination Intelligence**: Real-time weather forecasts and local time display for arrival destinations using OpenWeatherMap API
- **🔗 Multistop Flight Tracking**: Search multiple connecting flights simultaneously (comma-separated) with automatic connection time calculation and tight connection warnings

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cinzel, Playfair Display, JetBrains Mono)

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Configuration

The application requires two API keys:

### 1. Aviation Stack API
Used for real-time flight data. The key is configured in `.env.local`:
```
AVIATION_STACK_API_KEY=your_aviation_stack_api_key_here
```

**Get your free Aviation Stack API key**: [https://aviationstack.com/](https://aviationstack.com/)

### 2. OpenWeatherMap API (for Destination Intelligence)
Required for weather forecasts at arrival destinations. Add your key to `.env.local`:
```
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
```

**Get your free OpenWeatherMap API key**: [https://openweathermap.org/api](https://openweathermap.org/api)

**Note**: After adding environment variables to `.env.local`, restart your development server.

## 📱 Usage

1. Enter a flight IATA code (e.g., `BA123`, `AA100`) in the search field
2. Click the search button or press Enter (or click a recent search tag)
3. View the enhanced digital ticket with:
   - **Header**: Flight number, airline, and color-coded status badge
   - **Departure/Arrival**: Airports, IATA codes, scheduled times with timezones
   - **Progress Bar**: Visual indicator showing flight completion percentage
   - **Duration**: Total flight time calculated from schedule
   - **Terminal & Gate**: Location information (when available)
   - **Tech Specs**: Aircraft model and registration (when available)
4. Your successful searches are automatically saved and appear as clickable tags below the input

## 🎯 Project Structure

```
aviation/
├── app/
│   ├── actions/
│   │   └── flight-search.ts      # Server Action for API calls
│   ├── components/
│   │   ├── FlightSearchInput.tsx # Search input with animations
│   │   ├── FlightTicket.tsx      # Result display component
│   │   └── Navbar.tsx            # Global navigation bar
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard view
│   ├── login/
│   │   └── page.tsx              # Login page with guest access
│   ├── types/
│   │   └── aviation.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── flightHistory.ts      # LocalStorage utility
│   ├── globals.css               # Global styles and utilities
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Landing page
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 Key Design Elements

### Colors
- **Background**: `#020617` (Abyss Blue)
- **Surface**: Glass morphism with backdrop blur
- **Accent**: `#F59E0B` (Electric Amber)
- **Text**: White with varying opacity

### Typography
- **Headlines**: Cinzel/Playfair Display (elegant, sharp)
- **Data**: JetBrains Mono (monospace for technical data)

### Animations
- Page load: Staggered fade-in of elements
- Search: Scanning light effect over input
- Results: Digital ticket slides in with spring physics
- Loading: Rotating loader with smooth transitions

## 🔒 Security Features

- Server-side API calls to prevent CORS issues
- API key hidden from client-side code
- Secure data validation and error handling

## 📝 Error Handling

The application gracefully handles:
- Invalid flight numbers
- Empty API responses
- API rate limits (429 errors)
- Network failures
- Unexpected errors

All errors display stylized messages consistent with the Quantum Tracker aesthetic.

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📄 License

This project is for demonstration purposes.

## 🙏 Credits

- **API**: [Aviation Stack](https://aviationstack.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

