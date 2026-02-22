
import { BaseService, APIError } from './base.service';
import { SecurityService } from '@/utils/security';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Role = Database['public']['Tables']['user_roles']['Row']['role'];

export class AuthService extends BaseService {
    private static instance: AuthService;

    private constructor() {
        super();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async getUserRoles(userId: string): Promise<Role[]> {
        const currentUser = await this.getCurrentUser();

        // Users can only see their own roles unless they're admin
        if (currentUser.id !== userId) {
            const isAdmin = await this.isAdmin();
            if (!isAdmin) {
                throw new APIError('Unauthorized access to user roles', 'FORBIDDEN', 403);
            }
        }

        const { data, error } = await this.supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId);

        if (error) throw new APIError(error.message);
        return (data?.map(r => r.role) || []) as Role[];
    }

    async getProfile(userId: string): Promise<Profile | null> {
        await this.validateUserOwnership(userId);

        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw new APIError(error.message);
        return data;
    }

    async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
        const user = await this.validateUserOwnership(userId);

        const getString = (value: unknown): string => typeof value === 'string' ? value : '';

        const sanitizedData = {
            first_name: this.sanitize(getString(profileData.first_name)),
            last_name: this.sanitize(getString(profileData.last_name)),
            phone: this.sanitize(getString(profileData.phone)),
            bio: this.sanitize(getString(profileData.bio)),
            date_of_birth: profileData.date_of_birth,
            address: this.sanitize(getString(profileData.address)),
            avatar_url: profileData.avatar_url, // URL doesn't need basic sanitization but could be validated
            ministry: this.sanitize(getString(profileData.ministry)),
            gender: this.sanitize(getString(profileData.gender)),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await this.supabase
            .from('profiles')
            .upsert({
                user_id: userId,
                email: user.email,
                ...sanitizedData
            } as Database['public']['Tables']['profiles']['Insert'])
            .select()
            .single();

        if (error) throw new APIError(error.message);
        return data;
    }
}

export const authService = AuthService.getInstance();
