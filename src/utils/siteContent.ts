
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets content for a specific section from the site_content table
 * @param section The section identifier (e.g., 'home', 'about', 'services')
 * @returns Promise that resolves to the content HTML or null if not found
 */
export async function getSectionContent(section: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', section)
      .single();

    if (error || !data) {
      console.error('Error fetching section content:', error);
      return null;
    }

    return data.content;
  } catch (err) {
    console.error(`Error retrieving content for section ${section}:`, err);
    return null;
  }
}

/**
 * Updates content for a specific section in the site_content table
 * @param section The section identifier (e.g., 'home', 'about', 'services')
 * @param content The HTML content to save
 * @returns Promise that resolves to true if update was successful, false otherwise
 */
export async function updateSectionContent(section: string, content: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('site_content')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('section', section);

    if (error) {
      console.error('Error updating section content:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Error updating content for section ${section}:`, err);
    return false;
  }
}

/**
 * Gets all site content sections and their content
 * @returns Promise that resolves to an array of site content objects
 */
export async function getAllSiteContent() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section');

    if (error) {
      console.error('Error fetching all site content:', error);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Error retrieving all site content:', err);
    return [];
  }
}
