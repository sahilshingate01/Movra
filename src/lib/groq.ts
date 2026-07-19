/**
 * Groq AI client module.
 * Handles communication with the Groq API for generating AI chat responses.
 * Includes response caching and bounded conversation history.
 * @module lib/groq
 */

import Groq from 'groq-sdk';
import { AI_MODEL, AI_TEMPERATURE, MAX_AI_TOKENS, MAX_HISTORY_MESSAGES } from './constants';

/** Singleton Groq client instance — reused across all requests. */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY',
});

/**
 * Simple LRU-style cache for recent AI responses.
 * Keyed by a hash of (systemPrompt + last message). Entries expire after 5 minutes.
 * This avoids redundant API calls for identical repeated questions.
 */
const responseCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;

/**
 * Generates a non-cryptographic hash of a string for fast cache key lookups.
 * Implements the DJB2 algorithm.
 * @param str - The input string to hash.
 * @returns A hex-encoded hash string.
 */
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Generates a cache key from the full system prompt and user message to prevent collisions.
 * @param systemPrompt - The system instruction used for the AI model.
 * @param message - The user's input message.
 * @returns A string key for the cache lookup.
 */
function getCacheKey(systemPrompt: string, message: string): string {
  const combined = `${systemPrompt}::${message.toLowerCase().trim()}`;
  return hashString(combined);
}

/**
 * Evicts expired entries from the response cache.
 * Called before each cache lookup to keep memory usage bounded.
 */
function cleanCache(): void {
  const now = Date.now();
  for (const [key, entry] of responseCache) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      responseCache.delete(key);
    }
  }
  // If still over max size, remove oldest entries
  if (responseCache.size > MAX_CACHE_SIZE) {
    const keysToRemove = Array.from(responseCache.keys()).slice(0, responseCache.size - MAX_CACHE_SIZE);
    for (const key of keysToRemove) {
      responseCache.delete(key);
    }
  }
}

/**
 * Sends a chat completion request to the Groq API with bounded history and caching.
 *
 * @param systemInstruction - The role-specific system prompt.
 * @param history - Previous conversation messages (automatically trimmed to last N).
 * @param message - The user's current input message.
 * @returns An object with `text` (the reply) and `success` (whether the call succeeded).
 *
 * @example
 * ```ts
 * const result = await generateChatResponse(
 *   getPromptForRole('Fan'),
 *   [{ role: 'user', text: 'Where is Gate A?' }],
 *   'How do I get there from parking?'
 * );
 * console.log(result.text);
 * ```
 */
export async function generateChatResponse(
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[],
  message: string
): Promise<{ text: string; success: boolean }> {
  try {
    // Fail fast if API key is missing
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is missing.');
    }

    // Check cache for identical recent queries (only for cacheable short conversations)
    cleanCache();
    const cacheKey = getCacheKey(systemInstruction, message);
    const cached = responseCache.get(cacheKey);
    if (cached && history.length === 0) {
      return { text: cached.text, success: true };
    }

    // Build message array with bounded history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemInstruction },
    ];

    // Trim history to last MAX_HISTORY_MESSAGES to prevent unbounded payloads
    const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
    for (const h of trimmedHistory) {
      messages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.text,
      });
    }

    messages.push({ role: 'user', content: message });

    const completion = await groq.chat.completions.create({
      messages,
      model: AI_MODEL,
      temperature: AI_TEMPERATURE,
      max_tokens: MAX_AI_TOKENS,
    });

    const responseText =
      completion.choices[0]?.message?.content ||
      'I am sorry, I am unable to process that request right now.';

    // Cache the response for future identical queries
    responseCache.set(cacheKey, { text: responseText, timestamp: Date.now() });

    return { text: responseText, success: true };
  } catch (error) {
    console.error('Groq API Error:', error);
    return {
      text: 'Sorry, the Stadium AI assistant is currently experiencing high load. Please try again in a moment.',
      success: false,
    };
  }
}
