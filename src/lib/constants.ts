/**
 * Application-wide constants.
 * Centralizes magic numbers, configuration values, and static data
 * to improve maintainability and make tuning straightforward.
 */

// ─── API & Chat ───────────────────────────────────────────────────────────────

/** Maximum number of characters allowed in a single chat message. */
export const MAX_MESSAGE_LENGTH = 1000;

/** Maximum number of history messages sent to the AI API per request. */
export const MAX_HISTORY_MESSAGES = 10;

/** Maximum tokens the AI model should generate per response. */
export const MAX_AI_TOKENS = 1024;

/** Temperature parameter for AI response generation (0.0–1.0). */
export const AI_TEMPERATURE = 0.7;

/** The Groq model identifier used for completions. */
export const AI_MODEL = 'llama-3.3-70b-versatile';

/** Maximum allowed request body size in bytes (50 KB). */
export const MAX_REQUEST_BODY_BYTES = 50 * 1024;

// ─── Rate Limiting ────────────────────────────────────────────────────────────

/** Default rate limit: max requests per window. */
export const RATE_LIMIT_MAX_REQUESTS = 10;

/** Default rate limit: window duration in milliseconds. */
export const RATE_LIMIT_WINDOW_MS = 10_000;

/** How long (ms) before stale rate-limit entries are evicted. */
export const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000;

/** Seconds to include in the Retry-After header on 429 responses. */
export const RATE_LIMIT_RETRY_AFTER_SECONDS = 10;

// ─── Crowd Heatmap ────────────────────────────────────────────────────────────

/** Interval (ms) between simulated crowd density updates. */
export const CROWD_UPDATE_INTERVAL_MS = 3_000;

/** Density percentage threshold considered "high congestion." */
export const HIGH_DENSITY_THRESHOLD = 85;

/** Density percentage threshold considered "moderate congestion." */
export const MODERATE_DENSITY_THRESHOLD = 60;

// ─── Map ──────────────────────────────────────────────────────────────────────

/** Center coordinates for MetLife Stadium (FIFA 2026 venue). */
export const STADIUM_CENTER: [number, number] = [40.8128, -74.0745];

/** Default zoom level for the Leaflet map. */
export const MAP_DEFAULT_ZOOM = 16;

// ─── Validation ───────────────────────────────────────────────────────────────

/** Valid roles that can be passed via query parameters. */
export const VALID_ROLES = ['Fan', 'Organizer', 'Volunteer', 'Staff'] as const;
