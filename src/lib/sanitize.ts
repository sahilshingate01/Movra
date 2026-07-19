/**
 * Basic input sanitization to prevent XSS and Prompt Injection.
 * In a full production environment, you might use DOMPurify for HTML sanitization
 * and more complex heuristics for prompt injection.
 */

// Escape HTML entities to prevent XSS
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Basic guard against prompt injection attempts (e.g., "ignore all previous instructions")
export function isPromptInjectionAttempt(input: string): boolean {
  const normalizedInput = input.toLowerCase();
  
  const suspiciousPhrases = [
    "ignore all previous instructions",
    "ignore previous instructions",
    "forget everything",
    "you are now",
    "system prompt",
    "bypass",
    "override"
  ];
  
  return suspiciousPhrases.some(phrase => normalizedInput.includes(phrase));
}

export function sanitizeInput(input: string): { sanitized: string; isValid: boolean; reason?: string } {
  if (!input || input.trim() === '') {
    return { sanitized: '', isValid: false, reason: 'Empty input' };
  }
  
  if (input.length > 1000) {
    return { sanitized: '', isValid: false, reason: 'Input too long (max 1000 characters)' };
  }
  
  if (isPromptInjectionAttempt(input)) {
    return { sanitized: '', isValid: false, reason: 'Security policy violation detected' };
  }
  
  return { 
    sanitized: escapeHtml(input.trim()), 
    isValid: true 
  };
}
