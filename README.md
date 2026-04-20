# BeatTheCrowd 🏟️

## Chosen Vertical
**Smart Sporting Venue Experience** — Attendee Navigation & Crowd Intelligence

## Positioning Statement
"BeatTheCrowd is an AI-powered, mobile-first crowd intelligence platform that leverages real-time analytics, predictive modeling, and personalized navigation to transform the stadium experience by minimizing congestion, reducing wait times, and maximizing fan engagement."

## Architecture
```text
[ Fan Mobile App ] <───> [ Gemini 1.5 Flash ] (AI Concierge)
       │                         ^
       │                         │
       v                         │
[ Firebase RTDB ] <──────────────┘
(Live Venue Data)
       ^
       │
[ Simulation Engine ] (Mock Sensors)
```

## Google Services Used
- **Google Gemini 1.5 Flash**: Orchestrates the "AI Assistant" to provide conversational, data-driven navigation advice to fans. It consumes the live JSON state of the stadium to suggest the path of least resistance.
- **Firebase Realtime Database**: Acts as the "Digital Twin" of the stadium. It stores and synchronizes live crowd levels, wait times, and gate statuses across all connected fan devices in sub-second latency.
- **Google Fonts**: Utilizes "Inter" for clean readability and "JetBrains Mono" for high-precision metric displays.
- **Vite/PWA**: Configured for rapid deployment and native-like offline performance.

## Setup Instructions
1. **Clone & Install**: `npm install`
2. **Env Config**: Create a `.env` file with `VITE_GEMINI_API_KEY` and your Firebase credentials.
3. **Database Seed**: The app automatically seeds the initial 12 stadium zones on the first load.
4. **Run Simulation**: Tap the **Play** button in the dashboard to start the real-time sensor simulation.
5. **Launch**: `npm run dev` and open `localhost:5173`.

## How It Works
1. **Enter**: The app suggests the **Smart Entry Gate** based on current traffic.
2. **Navigate**: Fans use the **AI-Optimized Routing** to find seats, avoiding congested concourses.
3. **Order**: Fans use **Queue-less Ordering** to skip food lines, getting a notification when their meal is ready.
4. **Exit**: During peak exit times, the **Emergency Mode** activates to distribute fans across safe, low-density exits.

## Assumptions Made
- The stadium is equipped with IoT sensors (simulated by the `mockSimulator`) that report occupancy data every 20 seconds.
- Fans have access to mobile data or stadium Wi-Fi for live updates.
- Seat locations are mapped to internal zone IDs.

## Future Scope
- **AR Concierge**: Overlaying route lines directly onto the user's camera feed.
- **Wearable Integration**: Haptic pulses on smartwatches to indicate when to turn during navigation.
- **Smart City Sync**: Connecting stadium exit flows to local public transport (buses/trains) for seamless post-match travel.

---
*Built for the Google AI Hackathon 2024.*
