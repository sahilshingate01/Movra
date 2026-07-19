/**
 * Input sanitization utilities.
 * Provides XSS prevention via HTML entity escaping and basic prompt injection detection.
 *
 * @module lib/sanitize
 */

import { MAX_MESSAGE_LENGTH } from './constants';

/**
 * Escapes HTML entities in a string to prevent Cross-Site Scripting (XSS) attacks.
 *
 * @param unsafe - The raw, potentially unsafe input string.
 * @returns The input with `&`, `<`, `>`, `"`, and `'` replaced by their HTML entities.
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert(1)</script>');
 * // Returns: '&lt;script&gt;alert(1)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Known phrases commonly used in LLM prompt injection attacks.
 * Kept as a module-level constant to avoid re-allocating on every call.
 */
const SUSPICIOUS_PHRASES: readonly string[] = [
  'ignore all previous instructions',
  'ignore previous instructions',
  'forget everything',
  'you are now',
  'system prompt',
  'bypass',
  'override',
] as const;

/**
 * Detects common prompt injection attempts by checking for suspicious phrases.
 *
 * @param input - The user's raw input string.
 * @returns `true` if the input contains a known injection pattern; `false` otherwise.
 *
 * @example
 * ```ts
 * isPromptInjectionAttempt('ignore all previous instructions'); // true
 * isPromptInjectionAttempt('Where is Gate A?');                 // false
 * ```
 */
export function isPromptInjectionAttempt(input: string): boolean {
  const normalizedInput = input.toLowerCase();
  return SUSPICIOUS_PHRASES.some(phrase => normalizedInput.includes(phrase));
}

/** Result of the {@link sanitizeInput} function. */
export interface SanitizeResult {
  /** The cleaned, HTML-escaped input (empty string if invalid). */
  sanitized: string;
  /** Whether the input passed all validation checks. */
  isValid: boolean;
  /** Human-readable reason for rejection (only present when `isValid` is false). */
  reason?: string;
}

/**
 * Validates and sanitizes user input before sending it to the AI model.
 * Performs three checks in order:
 * 1. Rejects empty / whitespace-only input.
 * 2. Rejects input exceeding {@link MAX_MESSAGE_LENGTH} characters.
 * 3. Rejects input matching known prompt injection patterns.
 *
 * If all checks pass, the input is trimmed and HTML-escaped.
 *
 * @param input - The raw user input string.
 * @returns A {@link SanitizeResult} with the cleaned string or rejection reason.
 *
 * @example
 * ```ts
 * const { sanitized, isValid, reason } = sanitizeInput('<b>Hello</b>');
 * // isValid: true, sanitized: '&lt;b&gt;Hello&lt;/b&gt;'
 * ```
 */
export function sanitizeInput(input: string): SanitizeResult {
  if (!input || input.trim() === '') {
    return { sanitized: '', isValid: false, reason: 'Empty input' };
  }

  if (input.length > MAX_MESSAGE_LENGTH) {
    return { sanitized: '', isValid: false, reason: `Input too long (max ${MAX_MESSAGE_LENGTH} characters)` };
  }

  if (isPromptInjectionAttempt(input)) {
    return { sanitized: '', isValid: false, reason: 'Security policy violation detected' };
  }

  return {
    sanitized: escapeHtml(input.trim()),
    isValid: true,
  };
}
