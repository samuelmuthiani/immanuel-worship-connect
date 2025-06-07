
import { z } from 'zod';

// Comprehensive validation schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().refine(
    (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, '')),
    'Invalid phone number'
  ),
  subject: z.string().max(200, 'Subject too long').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  inquiry_type: z.enum(['general', 'prayer', 'ministry', 'event', 'support'])
});

export const eventRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().refine(
    (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, '')),
    'Invalid phone number'
  )
});

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name required').max(50, 'First name too long').optional(),
  last_name: z.string().min(1, 'Last name required').max(50, 'Last name too long').optional(),
  phone: z.string().optional().refine(
    (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, '')),
    'Invalid phone number'
  ),
  date_of_birth: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Invalid date format'
  ),
  address: z.string().max(200, 'Address too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  ministry: z.string().max(100, 'Ministry name too long').optional(),
  gender: z.enum(['male', 'female', 'other', '']).optional()
});

// Enhanced sanitization with proper escaping
export class DataValidation {
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>\"'&]/g, (match) => {
        const entities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match] || match;
      })
      .substring(0, 1000); // Max length safety
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    if (!phone) return true; // Optional field
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return /^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone);
  }

  static normalizePhoneNumber(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[\s\-\(\)]/g, '').replace(/^0/, '+254');
  }

  static async validateAndSanitize<T>(
    data: unknown,
    schema: z.ZodSchema<T>
  ): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private static attempts = new Map<string, { count: number; lastAttempt: number }>();
  
  static isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now - record.lastAttempt > windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    record.lastAttempt = now;
    return true;
  }
  
  static reset(key: string): void {
    this.attempts.delete(key);
  }
}
