
import { BaseService, APIError } from './base.service';
import { Database } from '@/integrations/supabase/types';

export class AdminService extends BaseService {
    private static instance: AdminService;

    private constructor() {
        super();
    }

    public static getInstance(): AdminService {
        if (!AdminService.instance) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }

    private async ensureAdmin() {
        const isAdmin = await this.isAdmin();
        if (!isAdmin) {
            throw new APIError('Administrative access required', 'FORBIDDEN', 403);
        }
    }

    async getContactSubmissions() {
        await this.ensureAdmin();
        const { data, error } = await this.supabase
            .from('contact_submissions')
            .select('*')
            .order('submitted_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getNewsletterSubscribers() {
        await this.ensureAdmin();
        const { data, error } = await this.supabase
            .from('newsletter_subscribers')
            .select('id, name, email, consent, created_at, source_page')
            .order('created_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getEventRegistrations() {
        await this.ensureAdmin();
        const { data, error } = await this.supabase
            .from('event_registrations')
            .select(`
        *,
        events(title, event_date)
      `)
            .order('registered_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getUserProfiles() {
        await this.ensureAdmin();
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }
}

export const adminService = AdminService.getInstance();
