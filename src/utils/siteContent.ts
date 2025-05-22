
import { supabase } from '@/integrations/supabase/client';

export interface SiteContentSection {
  content: string;
  section: string;
  id: string;
  updated_at?: string;
}

// Cache for site content to reduce database queries
let contentCache: Record<string, {
  content: string;
  timestamp: number;
}> = {};

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Get content for a specific section from the database
 */
export async function getSectionContent(section: string): Promise<string> {
  // Check cache first
  const now = Date.now();
  const cachedContent = contentCache[section];
  
  if (cachedContent && (now - cachedContent.timestamp < CACHE_TTL)) {
    return cachedContent.content;
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', section)
      .single();

    if (error) {
      console.error(`Error fetching ${section} content:`, error);
      return '';
    }

    // Update cache
    contentCache[section] = {
      content: data?.content || '',
      timestamp: now
    };

    return data?.content || '';
  } catch (error) {
    console.error(`Error in getSectionContent for ${section}:`, error);
    return '';
  }
}

/**
 * Invalidate the cache for a specific section or all sections
 */
export function invalidateContentCache(section?: string) {
  if (section) {
    delete contentCache[section];
  } else {
    contentCache = {};
  }
}

/**
 * Get all site content sections
 */
export async function getAllSiteContent(): Promise<SiteContentSection[]> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section');

    if (error) {
      console.error('Error fetching all site content:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllSiteContent:', error);
    return [];
  }
}

/**
 * Update content for a specific section
 */
export async function updateSectionContent(section: string, content: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ section, content, updated_at: new Date().toISOString() });

    if (error) {
      console.error(`Error updating ${section} content:`, error);
      return false;
    }

    // Invalidate cache for this section
    invalidateContentCache(section);
    
    return true;
  } catch (error) {
    console.error(`Error in updateSectionContent for ${section}:`, error);
    return false;
  }
}

export default {
  getSectionContent,
  getAllSiteContent,
  updateSectionContent,
  invalidateContentCache
};
