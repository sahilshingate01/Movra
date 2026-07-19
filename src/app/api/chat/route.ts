/**
 * POST /api/chat — AI Chat endpoint.
 *
 * Accepts a user message and role, validates and sanitizes input,
 * enforces rate limiting, and returns an AI-generated response
 * from the Groq API using role-specific system prompts.
 *
 * @module app/api/chat/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/groq';
import { getPromptForRoleAndLanguage } from '@/lib/prompts';
import { sanitizeInput } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rateLimit';
import type { Role, Language, VenueState } from '@/lib/types';
import type { ChatApiRequest, ChatApiError, ChatApiResponse } from '@/lib/types';
import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_RETRY_AFTER_SECONDS,
  MAX_REQUEST_BODY_BYTES,
  VALID_ROLES,
} from '@/lib/constants';

/**
 * Type guard that checks if a string is a valid {@link Role}.
 *
 * @param value - The string to validate.
 * @returns `true` if the value is one of the known roles.
 */
function isValidRole(value: string): value is Role {
  return (VALID_ROLES as readonly string[]).includes(value);
}

/**
 * Type guard that checks if a string is a valid {@link Language}.
 *
 * @param value - The string to validate.
 * @returns `true` if the value is one of the supported languages.
 */
function isValidLanguage(value: string): value is Language {
  return ['en', 'es', 'fr', 'ar', 'pt'].includes(value);
}

/**
 * Formats client-provided venue state into a clear text-based summary for the AI.
 *
 * @param state - The real-time venue telemetry state.
 * @returns A formatted string or empty string if no state is provided.
 */
function formatVenueContext(state?: VenueState): string {
  if (!state) return '';

  const parts: string[] = ['\n=== CURRENT STADIUM REAL-TIME TELEMETRY ==='];

  if (state.crowd && state.crowd.length > 0) {
    parts.push('- Crowd Densities per Zone:');
    for (const z of state.crowd) {
      parts.push(`  * ${z.name}: ${z.density}% (Trend: ${z.trend})`);
    }
  }

  if (state.transit && state.transit.length > 0) {
    parts.push('- Transit Status & Departures:');
    for (const t of state.transit) {
      parts.push(`  * ${t.name}: ${t.status} (Next: ${t.next})`);
    }
  }

  if (state.accessibility && state.accessibility.length > 0) {
    parts.push('- Accessibility Services:');
    for (const a of state.accessibility) {
      parts.push(`  * ${a.name} at ${a.location}: ${a.status}`);
    }
  }

  if (state.operations) {
    parts.push('- Operations Intelligence (KPIs):');
    parts.push(`  * Attendance: ${state.operations.attendance}`);
    parts.push(`  * Gate Flow Rate: ${state.operations.gateFlow}`);
    parts.push(`  * Time to Kickoff: ${state.operations.timeToKickoff}`);
    if (state.operations.incidents && state.operations.incidents.length > 0) {
      parts.push('  * Active Logged Incidents:');
      for (const inc of state.operations.incidents) {
        parts.push(`    - ${inc}`);
      }
    }
  }

  parts.push('===========================================\n');
  return parts.join('\n');
}

/**
 * Creates a JSON error response with consistent structure.
 *
 * @param error - Human-readable error message.
 * @param status - HTTP status code.
 * @param code - Machine-readable error code for client handling.
 * @param headers - Additional headers to include.
 * @returns A NextResponse with the error payload.
 */
function errorResponse(
  error: string,
  status: number,
  code?: string,
  headers?: Record<string, string>
): NextResponse<ChatApiError> {
  return NextResponse.json(
    { error, code },
    { status, headers }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (IP-based, Token Bucket algorithm)
    const ip = (req as unknown as { ip?: string }).ip || req.headers.get('x-forwarded-for') || 'anonymous';
    const limitResult = rateLimit(ip, {
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!limitResult.success) {
      return errorResponse(
        'Too many requests. Please try again later.',
        429,
        'RATE_LIMITED',
        {
          'X-RateLimit-Limit': limitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'Retry-After': RATE_LIMIT_RETRY_AFTER_SECONDS.toString(),
        }
      );
    }

    // 2. Request body size guard
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_BYTES) {
      return errorResponse('Request body too large', 413, 'PAYLOAD_TOO_LARGE');
    }

    // 3. Parse and validate request body
    let body: ChatApiRequest;
    try {
      body = await req.json();
    } catch {
      return errorResponse('Invalid JSON in request body', 400, 'INVALID_JSON');
    }

    const { message, role, history, language, venueState } = body;

    // 4. Validate message
    if (!message || typeof message !== 'string') {
      return errorResponse('Message is required and must be a string', 400, 'MISSING_MESSAGE');
    }

    // 5. Sanitize input (XSS + prompt injection)
    const { sanitized, isValid, reason } = sanitizeInput(message);
    if (!isValid) {
      return errorResponse(reason || 'Invalid input', 400, 'INVALID_INPUT');
    }

    // 6. Validate role with type guard
    const userRole: Role = (typeof role === 'string' && isValidRole(role)) ? role : 'Fan';

    // 7. Validate language
    const userLanguage: Language = (typeof language === 'string' && isValidLanguage(language)) ? language : 'en';

    // 8. Generate system prompt with role + language and real-time telemetry context
    let systemPrompt = getPromptForRoleAndLanguage(userRole, userLanguage);
    const telemetryContext = formatVenueContext(venueState);
    if (telemetryContext) {
      systemPrompt += telemetryContext;
    }

    // 9. Generate AI response
    const response = await generateChatResponse(systemPrompt, history || [], sanitized);

    if (!response.success) {
      return errorResponse(
        'Failed to generate response from AI service.',
        503,
        'AI_SERVICE_UNAVAILABLE'
      );
    }

    // 10. Return success response
    const successBody: ChatApiResponse = {
      reply: response.text,
      role: userRole,
    };

    return NextResponse.json(successBody, {
      headers: {
        'X-RateLimit-Limit': limitResult.limit.toString(),
        'X-RateLimit-Remaining': limitResult.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return errorResponse('Internal Server Error', 500, 'INTERNAL_ERROR');
  }
}
