
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS.
 * Allows a safe subset of tags and attributes.
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}

/**
 * Sanitize plain text input.
 * Removes potentially dangerous characters and trims whitespace.
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Remove dangerous characters
    .substring(0, maxLength);
}

/**
 * Generate a cryptographically secure CSRF token.
 */
export function generateCSRFToken(): string {
  return window.crypto.randomUUID();
}

/**
 * Validate a CSRF token against a stored value.
 */
export function validateCSRFToken(token: string | null, storedToken: string | null): boolean {
  if (!token || !storedToken) return false;
  return token === storedToken;
}

/**
 * Session management utilities.
 */
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function updateLastActivity() {
  localStorage.setItem('last_activity', Date.now().toString());
}

export function isSessionExpired(): boolean {
  const lastActivity = localStorage.getItem('last_activity');
  if (!lastActivity) return true;
  
  const now = Date.now();
  const elapsed = now - parseInt(lastActivity);
  
  return elapsed > SESSION_TIMEOUT;
}

/**
 * Simple client-side rate limiting.
 */
const attempts = new Map<string, number[]>();

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const userAttempts = attempts.get(identifier) || [];
  
  // Remove old attempts
  const recentAttempts = userAttempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false;
  }
  
  recentAttempts.push(now);
  attempts.set(identifier, recentAttempts);
  return true;
}

/**
 * Security event logger.
 */
export function logSecurityEvent(event: string, details: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  console.warn('[SECURITY EVENT]', logEntry);
  
  // In a real production app, you would send this to a logging service like Sentry or a custom backend.
}
