
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  published_at: string;
  author_email?: string;
}

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log('Fetching published blog posts...');
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
    
    console.log('Blog posts fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    console.log('Fetching blog post:', id);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
    
    console.log('Blog post fetched:', !!data);
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

export const createBlogPost = async (postData: {
  title: string;
  content: string;
  publish_now?: boolean;
}): Promise<{ success: boolean; data?: BlogPost; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Sanitize inputs
    const sanitizedData = {
      title: SecurityService.sanitizeInput(postData.title),
      content: SecurityService.sanitizeInput(postData.content),
      author_id: user.id,
      published_at: postData.publish_now ? new Date().toISOString() : null
    };

    console.log('Creating blog post:', sanitizedData.title);

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([sanitizedData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
    
    console.log('Blog post created successfully:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, error };
  }
};

export const updateBlogPost = async (id: string, postData: {
  title?: string;
  content?: string;
  publish_now?: boolean;
}): Promise<{ success: boolean; data?: BlogPost; error?: any }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Sanitize inputs
    const sanitizedData: any = {};
    if (postData.title) sanitizedData.title = SecurityService.sanitizeInput(postData.title);
    if (postData.content) sanitizedData.content = SecurityService.sanitizeInput(postData.content);
    if (postData.publish_now !== undefined) {
      sanitizedData.published_at = postData.publish_now ? new Date().toISOString() : null;
    }

    console.log('Updating blog post:', id);

    const { data, error } = await supabase
      .from('blog_posts')
      .update(sanitizedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
    
    console.log('Blog post updated successfully:', data.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { success: false, error };
  }
};
