
import { supabase } from '@/integrations/supabase/client';

export const SITE_SECTIONS = [
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'services', label: 'Services' },
  { key: 'home', label: 'Home' },
];

interface SiteContentOptions {
  section: string;
  fallback?: string;
  cacheTime?: number;
}

const contentCache: Record<string, { content: string; timestamp: number }> = {};

/**
 * Fetches content for a specific section of the site
 * Uses a simple in-memory cache to avoid unnecessary database queries
 */
export async function getSiteContent({ 
  section, 
  fallback = '', 
  cacheTime = 5 * 60 * 1000 
}: SiteContentOptions) {
  // Check cache first
  const cached = contentCache[section];
  const now = Date.now();
  
  if (cached && (now - cached.timestamp < cacheTime)) {
    return cached.content;
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', section)
      .single();
      
    if (error) {
      console.error(`Error fetching ${section} content:`, error);
      return fallback;
    }
    
    const content = data?.content || fallback;
    
    // Update cache
    contentCache[section] = { content, timestamp: now };
    
    return content;
  } catch (err) {
    console.error(`Exception fetching ${section} content:`, err);
    return fallback;
  }
}

/**
 * Updates content for a specific section of the site
 */
export async function updateSiteContent(section: string, content: string) {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ section, content });
      
    if (error) {
      console.error(`Error updating ${section} content:`, error);
      return false;
    }
    
    // Update cache
    contentCache[section] = { content, timestamp: Date.now() };
    
    return true;
  } catch (err) {
    console.error(`Exception updating ${section} content:`, err);
    return false;
  }
}

/**
 * Clears the content cache for a specific section or all sections
 */
export function clearContentCache(section?: string) {
  if (section) {
    delete contentCache[section];
  } else {
    Object.keys(contentCache).forEach(key => delete contentCache[key]);
  }
}
