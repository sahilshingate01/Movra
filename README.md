# Movra — FIFA World Cup 2026 Stadium Assistant

**🚀 Live Deployment:** [https://movra-gray.vercel.app/](https://movra-gray.vercel.app/)

Movra is a GenAI-powered stadium operations and fan experience platform built for the FIFA World Cup 2026. This intelligent assistant seamlessly adapts to four distinct personas (Fan, Organizer, Volunteer, and Staff) to provide context-aware navigation, crowd management, transportation schedules, sustainability tracking, multilingual assistance, and accessibility services.

## Chosen Vertical: Multi-Persona Stadium Intelligence

Rather than building separate apps for different stakeholders, Movra provides a unified AI interface that customizes its capabilities based on the user's role:

* **Fans** get navigation to seats, restrooms, food, and accessible routes — plus real-time match updates.
* **Organizers** monitor crowd density, operational bottlenecks, and KPI dashboards for decision support.
* **Volunteers** receive guidance for assisting guests, handling FAQs, and multilingual communication.
* **Staff** get rapid incident response protocols, vendor coordination, and prioritized action items.

## Core Features & GenAI Integration

| Feature | GenAI Role | Problem Statement Area |
|---|---|---|
| **Context-Aware AI Chat** | Groq (Llama 3.3 70B) with role-specific system prompts | Real-time decision support |
| **Multilingual Assistance** | AI responds in EN/ES/FR/AR/PT based on user selection | Multilingual assistance |
| **Interactive Wayfinding** | Leaflet map with stadium POIs and keyboard nav | Navigation |
| **Real-time Crowd Heatmap** | Simulated density with auto-alerts for congestion | Crowd management |
| **Operational Intelligence KPIs** | Live metrics bar for Organizer/Staff roles | Operational intelligence |
| **Sustainability Eco Tracker** | CO₂ footprint tracking and green amenity finder | Sustainability |
| **Accessibility Services** | Wheelchair routes, sensory rooms, audio descriptions | Accessibility |
| **Transportation Hub** | Transit status and rideshare availability | Transportation |

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, SSR) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 (responsive, utility-first) |
| **AI** | Groq SDK (`llama-3.3-70b-versatile`) |
| **Maps** | Leaflet + react-leaflet |
| **Icons** | Lucide React |
| **Testing** | Vitest + React Testing Library |

## Architecture & Code Quality

* **Centralized types** (`src/lib/types.ts`) — single source of truth for all shared interfaces.
* **Constants module** (`src/lib/constants.ts`) — no magic numbers; all config values are named and documented.
* **JSDoc on all exports** — every public function has comprehensive documentation with examples.
* **Error Boundary** — graceful fallback UI prevents white-screen-of-death errors.
* **React performance patterns** — `React.memo`, `useCallback`, `useMemo` across all components.
* **AbortController** — cancellable fetch requests in the chat interface.
* **Response caching** — LRU cache in the Groq client prevents redundant API calls.
* **Bounded conversation history** — limits payload size to last 10 messages.

## Security Measures

1. **API Key Protection:** The Groq API key remains securely on the server via Next.js API Routes (`/api/chat`).
2. **Rate Limiting:** Custom Token Bucket algorithm with automatic cleanup of stale entries (prevents memory leaks).
3. **Input Sanitization:** HTML entity escaping (XSS prevention) + prompt injection detection with known-phrase matching.
4. **Security Headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy.
5. **Request Validation:** Body size limits, typed role/language validation with type guards, structured error codes.
6. **Rate Limit Headers:** `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining` on all API responses.

## Accessibility (WCAG 2.1 AA)

* **Skip-to-content link** — keyboard users can bypass navigation (WCAG 2.4.1).
* **Focus-visible styles** — clear focus indicators for all interactive elements (WCAG 2.4.7).
* **Reduced motion** — `prefers-reduced-motion` media query disables all animations (WCAG 2.3.3).
* **Semantic HTML** — `<main>`, `<nav>`, `<aside>`, `<header>`, `<section>` with `aria-label` attributes.
* **ARIA roles** — `role="log"`, `role="progressbar"`, `role="list"`, `role="alert"`, `aria-live="polite"`.
* **Keyboard accessibility** — all map markers and interactive elements support keyboard navigation.
* **Decorative icons** — `aria-hidden="true"` on all non-informative icons.

## Testing

* **54 tests** across 6 test files — all passing.
* **Unit tests:** Rate limiter (token bucket algorithm), input sanitization (XSS + injection), prompts (role coverage + multilingual).
* **Component tests:** ChatPanel (rendering, input, API integration, error handling), AccessPanel (services, list structure).
* **API route tests:** Validation, rate limiting, error codes, language support, role fallback.

Run tests:
```bash
npm test
```

## Efficiency Optimizations

* `React.memo` on all leaf components (CrowdHeatmap, TransportPanel, EcoTracker, AccessPanel, LeafletMap).
* `useMemo` for sorted/filtered data, static arrays, and computed values.
* `useCallback` for all event handlers to prevent unnecessary re-renders.
* `AbortController` for cancellable API requests in the chat panel.
* LRU response cache with TTL-based eviction in the Groq client.
* Bounded conversation history (max 10 messages per request).
* Rate limit store cleanup to prevent memory leaks.
* Dynamic import for Leaflet map (client-only, no SSR).

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Assumptions Made

* We are simulating real-time crowd density and transit data, as we cannot connect to live FIFA sensors.
* We assume the event takes place in one of the 16 official FIFA 2026 venues (MetLife Stadium as default, venue-agnostic interface).
* The AI responses are generated by Llama 3.3 70B through Groq with role-specific and language-aware system prompts.
* Operational KPI data is simulated for demonstration; in production this would connect to real venue telemetry.
