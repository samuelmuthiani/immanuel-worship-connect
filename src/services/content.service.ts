
import { BaseService, APIError } from './base.service';
import { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];
type Sermon = Database['public']['Tables']['sermons']['Row'];

export class ContentService extends BaseService {
    private static instance: ContentService;

    private constructor() {
        super();
    }

    public static getInstance(): ContentService {
        if (!ContentService.instance) {
            ContentService.instance = new ContentService();
        }
        return ContentService.instance;
    }

    async getBlogPosts(): Promise<Post[]> {
        const { data, error } = await this.supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getSermons(): Promise<Sermon[]> {
        const { data, error } = await this.supabase
            .from('sermons')
            .select('*')
            .order('sermon_date', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getMediaPhotos() {
        const { data, error } = await this.supabase
            .from('media_photos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getMediaVideos() {
        const { data, error } = await this.supabase
            .from('media_videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }
}

export const contentService = ContentService.getInstance();
