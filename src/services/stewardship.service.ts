
import { BaseService, APIError } from './base.service';
import { Database } from '@/integrations/supabase/types';

type Donation = Database['public']['Tables']['donations']['Row'];
type Appreciation = Database['public']['Tables']['appreciations']['Row'];

export class StewardshipService extends BaseService {
    private static instance: StewardshipService;

    private constructor() {
        super();
    }

    public static getInstance(): StewardshipService {
        if (!StewardshipService.instance) {
            StewardshipService.instance = new StewardshipService();
        }
        return StewardshipService.instance;
    }

    async createDonation(donationData: {
        amount: number;
        donation_type: string;
        payment_method?: string;
        transaction_reference?: string;
        notes?: string;
    }): Promise<Donation> {
        const user = await this.getCurrentUser();

        this.validateInput(donationData, {
            amount: (value) => typeof value === 'number' && value > 0 && value <= 1000000,
            donation_type: (value) => typeof value === 'string' && value.length > 0 && value.length <= 50,
            notes: (value) => !value || (typeof value === 'string' && value.length <= 500),
            payment_method: (value) => !value || typeof value === 'string',
            transaction_reference: (value) => !value || typeof value === 'string'
        });

        const sanitizedData = {
            ...donationData,
            donation_type: this.sanitize(donationData.donation_type),
            payment_method: donationData.payment_method ? this.sanitize(donationData.payment_method) : null,
            transaction_reference: donationData.transaction_reference ? this.sanitize(donationData.transaction_reference) : null,
            notes: donationData.notes ? this.sanitize(donationData.notes) : null
        };

        const { data, error } = await this.supabase
            .from('donations')
            .insert([{
                user_id: user.id,
                ...sanitizedData,
            }])
            .select()
            .single();

        if (error) throw new APIError(error.message);
        return data;
    }

    async getUserDonations(): Promise<Donation[]> {
        const user = await this.getCurrentUser();

        const { data, error } = await this.supabase
            .from('donations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async sendAppreciation(donationId: string, recipientId: string, message: string): Promise<Appreciation> {
        const user = await this.getCurrentUser();

        this.validateInput({ message }, {
            message: (value) => typeof value === 'string' && value.length > 0 && value.length <= 1000
        });

        const sanitizedMessage = this.sanitize(message);

        const { data, error } = await this.supabase
            .from('appreciations')
            .insert([{
                donation_id: donationId,
                sender_id: user.id,
                recipient_id: recipientId,
                message: sanitizedMessage
            }])
            .select()
            .single();

        if (error) throw new APIError(error.message);
        return data;
    }

    async getUserAppreciations(): Promise<Appreciation[]> {
        const user = await this.getCurrentUser();

        const { data, error } = await this.supabase
            .from('appreciations')
            .select(`
        *,
        donations(amount, donation_type, created_at)
      `)
            .eq('recipient_id', user.id)
            .order('sent_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }
}

export const stewardshipService = StewardshipService.getInstance();
