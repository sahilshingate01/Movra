/**
 * Centralized type definitions for the Movra application.
 * All shared interfaces and types are exported from this single module
 * to ensure consistency and maintainability across the codebase.
 */

// ─── Chat Types ───────────────────────────────────────────────────────────────

/** Supported user roles within the stadium assistant. */
export type Role = 'Fan' | 'Organizer' | 'Volunteer' | 'Staff';

/** Supported UI languages for multilingual assistance. */
export type Language = 'en' | 'es' | 'fr' | 'ar' | 'pt';

/** Human-readable labels for each supported language. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  pt: 'Português',
};

/** A single chat message displayed in the UI. */
export interface Message {
  /** Unique identifier for the message. */
  id: string;
  /** Whether the message was sent by the user or the AI model. */
  role: 'user' | 'model';
  /** The text content of the message. */
  text: string;
  /** When the message was created. */
  timestamp: Date;
}

/** Shape of the request body sent to POST /api/chat. */
export interface ChatApiRequest {
  /** The user's input message. */
  message: string;
  /** The active user role. */
  role: Role;
  /** Previous conversation messages for context. */
  history?: { role: 'user' | 'model'; text: string }[];
  /** The user's preferred response language. */
  language?: Language;
}

/** Shape of a successful response from POST /api/chat. */
export interface ChatApiResponse {
  /** The AI-generated reply text. */
  reply: string;
  /** The role that was used for prompt selection. */
  role: Role;
}

/** Shape of an error response from POST /api/chat. */
export interface ChatApiError {
  /** Human-readable error description. */
  error: string;
  /** Machine-readable error code for client-side handling. */
  code?: string;
}

// ─── Crowd Management Types ──────────────────────────────────────────────────

/** Represents a stadium zone with real-time crowd density data. */
export interface ZoneData {
  /** Unique zone identifier. */
  id: string;
  /** Display name of the zone. */
  name: string;
  /** Current crowd density as a percentage (0–100). */
  density: number;
  /** Whether density is currently increasing, decreasing, or stable. */
  trend: 'up' | 'down' | 'stable';
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

/** A point of interest on the stadium map. */
export interface PointOfInterest {
  /** Unique identifier for the point. */
  id: string;
  /** Display name of the location. */
  name: string;
  /** Category of the location (e.g., 'gate', 'concourse', 'field'). */
  type: string;
  /** Geographic latitude. */
  lat: number;
  /** Geographic longitude. */
  lng: number;
}

// ─── Transport Types ──────────────────────────────────────────────────────────

/** A transport option displayed in the Transit Hub panel. */
export interface TransportOption {
  /** Unique identifier. */
  id: string;
  /** Transport mode: 'train', 'bus', or 'car'. */
  type: 'train' | 'bus' | 'car';
  /** Display name of the service. */
  name: string;
  /** Current operational status. */
  status: string;
  /** Time until next departure or estimated wait. */
  next: string;
  /** Tailwind text color class. */
  color: string;
  /** Tailwind background color class. */
  bg: string;
}

// ─── Accessibility Types ──────────────────────────────────────────────────────

/** An accessibility service offered at the venue. */
export interface AccessibilityService {
  /** Unique identifier. */
  id: number;
  /** Name of the service. */
  name: string;
  /** React element for the service icon. */
  icon: React.ReactElement;
  /** Current availability status. */
  status: string;
  /** Physical location within the stadium. */
  location: string;
}
