
// Security utilities for input validation and sanitization
export class SecurityService {
  // Email validation with proper regex
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 320; // RFC 5321 limit
  }

  // Password strength validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'abc123'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push('Password contains common patterns that are not allowed');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential script tags
      .substring(0, 1000); // Limit length
  }

  // Sanitize email input
  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase().substring(0, 320);
  }

  // Rate limiting check (simple in-memory implementation)
  private static attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  static isRateLimited(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier);
    
    if (!attempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return false;
    }
    
    // Reset if window has passed
    if (now - attempts.lastAttempt > windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return false;
    }
    
    // Increment attempts
    attempts.count++;
    attempts.lastAttempt = now;
    
    return attempts.count > maxAttempts;
  }

  // Clear rate limiting for an identifier
  static clearRateLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }

  // Validate session token format
  static validateSessionToken(token: string): boolean {
    // Basic JWT format validation
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  // Check if user is accessing their own resources
  static validateUserOwnership(userId: string, resourceUserId: string): boolean {
    return userId === resourceUserId;
  }

  // CSRF protection - validate origin
  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.includes(origin);
  }
}
