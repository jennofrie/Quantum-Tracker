# 🚀 Quick Start Guide

## Installation Steps

1. **Install all dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open in browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

1. **Enter a Flight IATA Code**: Type a flight number like `BA123`, `AA100`, or `DL456`
2. **Search**: Click the search button or press Enter
3. **View Results**: See the beautiful digital ticket with all flight details
4. **Quick Access**: Click on any recent search tag to instantly re-search that flight
5. **Track Progress**: Watch the progress bar show real-time flight completion

## 🎨 What You'll See

### Search Interface
- Elegant glass-morphism input field with a scanning effect when focused
- Cockpit-inspired design with amber accents
- **Recent Search Tags**: Last 3 searches displayed as clickable "luggage tags" with gold borders on hover
- Responsive on all devices

### Flight Ticket Display
- **Header**: Flight number, airline name, and color-coded status badge
  - 🟡 Gold with pulse animation for active flights
  - 🟢 Emerald green for landed flights
  - 🔴 Crimson red for cancelled/incident flights
- **Route Information**: 
  - Departure and arrival airports with IATA codes
  - Scheduled times with timezones
  - Terminal and gate information
  - Date information
- **Progress Bar**: Visual gold line showing flight completion (0-100%)
  - Animated plane icon moving along the bar for in-flight status
  - Real-time percentage calculation
- **Duration Display**: Total flight time in hours and minutes
- **Tech Specs Footer**: Aircraft model and registration (when available, shown with low opacity)
- **Animations**: Smooth spring physics reveal with staggered elements
- **Error States**: Stylized error messages (not generic alerts)
- **Defensive Rendering**: Missing data sections gracefully hidden

## 🔍 Example Flight Codes to Try

Try these real flight codes (availability depends on current schedules):
- `BA747` - British Airways
- `AA100` - American Airlines  
- `LH400` - Lufthansa
- `DL456` - Delta Air Lines
- `UA900` - United Airlines
- `AF123` - Air France

**Note**: The API uses real flight data, so results depend on current flight schedules.

## ⚠️ Troubleshooting

### "No flight found"
- Verify the flight code is correct (IATA format)
- Check if the flight is currently scheduled
- Try different flight codes

### "API rate limit reached"
- The free tier has limited requests
- Wait a few minutes before trying again
- Consider upgrading the API plan for production use

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Delete `.next` folder and rebuild: `rm -rf .next && npm run dev`
- Check Node.js version (should be 18+)

## 🎨 Design Features Implemented

✅ **Typography**
- Cinzel for headlines
- Playfair Display for elegant text
- JetBrains Mono for data/codes

✅ **Color Palette**
- Deep Abyss Blue background (#020617)
- Glass-morphism surfaces with backdrop blur
- Electric Amber accents (#F59E0B)
- Metallic Silver for secondary text

✅ **Animations**
- Staggered fade-in on page load
- Scanning light effect on input focus
- Spring physics for ticket reveal
- Smooth loading states

✅ **Security**
- Server-side API calls (no CORS)
- No client-side API key exposure
- Type-safe implementation

## 📱 Mobile Experience

The application is fully responsive:
- Touch-friendly input fields
- Optimized layouts for small screens
- Readable typography on all devices
- Smooth animations on mobile

## 🚀 Next Steps

To deploy this application:

1. **Build for production**:
```bash
npm run build
```

2. **Start production server**:
```bash
npm start
```

3. **Deploy to Vercel** (recommended):
```bash
npm i -g vercel
vercel
```

Enjoy your Quantum Tracker flight tracking experience! ✈️

