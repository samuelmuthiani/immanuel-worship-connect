
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { SecurityService } from '@/utils/security';

export class APIError extends Error {
    constructor(message: string, public code?: string, public status?: number) {
        super(message);
        this.name = 'APIError';
    }
}

export abstract class BaseService {
    protected supabase = supabase;

    protected async getCurrentUser() {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        if (error) throw new APIError(error.message);
        if (!user) throw new APIError('User not authenticated', 'UNAUTHORIZED', 401);
        return user;
    }

    protected async validateUserOwnership(resourceUserId: string) {
        const user = await this.getCurrentUser();
        if (user.id !== resourceUserId) {
            throw new APIError('Unauthorized access to resource', 'FORBIDDEN', 403);
        }
        return user;
    }

    protected async isAdmin(): Promise<boolean> {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return false;

        const { data: roles } = await this.supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

        return roles?.some(r => r.role === 'admin') || false;
    }

    protected validateInput<T extends Record<string, unknown>>(input: T, rules: Partial<Record<keyof T, (value: unknown) => boolean>>) {
        const ruleKeys = Object.keys(rules) as (keyof T)[];
        for (const key of ruleKeys) {
            const validator = rules[key];
            if (typeof validator === 'function' && !validator(input[key])) {
                throw new APIError(`Invalid ${String(key)}`, 'VALIDATION_ERROR', 400);
            }
        }
    }

    protected sanitize(input: string): string {
        return SecurityService.sanitizeInput(input);
    }
}
