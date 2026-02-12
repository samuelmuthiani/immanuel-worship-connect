
import { BaseService, APIError } from './base.service';
import { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['blog_posts']['Row'];
interface Sermon {
    id: string;
    title: string;
    description: string | null;
    video_url: string | null;
    audio_url: string | null;
    speaker: string | null;
    series: string | null;
    date_preached: string | null;
    created_at: string | null;
    updated_at: string | null;
}

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
            .from('blog_posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getSermons(): Promise<Sermon[]> {
        const { data, error } = await (this.supabase as any)
            .from('sermons')
            .select('*')
            .order('date_preached', { ascending: false });

        if (error) throw new APIError(error.message);
        return (data || []) as Sermon[];
    }

    async getMediaPhotos() {
        const { data, error } = await this.supabase
            .from('media_photos')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }

    async getMediaVideos() {
        const { data, error } = await this.supabase
            .from('media_videos')
            .select('*')
            .order('uploaded_at', { ascending: false });

        if (error) throw new APIError(error.message);
        return data || [];
    }
}

export const contentService = ContentService.getInstance();
