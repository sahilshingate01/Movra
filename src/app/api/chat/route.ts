import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/groq';
import { getPromptForRole, Role } from '@/lib/prompts';
import { sanitizeInput } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // 1. IP-based Rate Limiting (10 requests per 10 seconds per IP)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const limitResult = rateLimit(ip, { maxRequests: 10, windowMs: 10000 });
    
    if (!limitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limitResult.limit.toString(),
            'X-RateLimit-Remaining': limitResult.remaining.toString(),
          }
        }
      );
    }

    // 2. Parse request
    const body = await req.json();
    const { message, role, history } = body;

    // 3. Validate and sanitize input
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { sanitized, isValid, reason } = sanitizeInput(message);
    if (!isValid) {
      return NextResponse.json(
        { error: reason || 'Invalid input' },
        { status: 400 }
      );
    }

    const userRole = (role as Role) || 'Fan';
    const systemPrompt = getPromptForRole(userRole);

    // 4. Generate AI Response
    const response = await generateChatResponse(systemPrompt, history || [], sanitized);

    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to generate response from AI service.' },
        { status: 500 }
      );
    }

    // 5. Return success
    return NextResponse.json({
      reply: response.text,
      role: userRole
    }, {
      headers: {
        'X-RateLimit-Limit': limitResult.limit.toString(),
        'X-RateLimit-Remaining': limitResult.remaining.toString(),
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
