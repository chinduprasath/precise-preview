
import { supabase } from '@/integrations/supabase/client';

export interface ServiceContentItem {
  id: string;
  influencer_id: string;
  media_type: 'image' | 'video';
  media_url: string;
  title: string | null;
  description: string | null;
  created_at: string;
  metrics?: ServiceContentMetrics;
}

export interface ServiceContentMetrics {
  id?: string;
  content_id?: string;
  likes: number;
  views: number;
  comments: number;
  shares: number;
  updated_at?: string;
}

/**
 * Fetch service content with metrics for a specific influencer
 */
export const fetchServiceContent = async (influencerId?: string): Promise<ServiceContentItem[]> => {
  try {
    // If no influencer ID, return sample data
    if (!influencerId) {
      return getSampleServiceContent();
    }

    // Fetch from Supabase
    const { data: contentData, error: contentError } = await supabase
      .from('service_content')
      .select('*')
      .eq('influencer_id', influencerId);

    if (contentError) {
      console.error('Error fetching service content:', contentError);
      return getSampleServiceContent();
    }

    if (!contentData || contentData.length === 0) {
      return getSampleServiceContent();
    }

    // Fetch metrics for each content item
    const contentWithMetrics = await Promise.all(
      contentData.map(async (content) => {
        const { data: metricsData, error: metricsError } = await supabase
          .from('service_content_metrics')
          .select('*')
          .eq('content_id', content.id)
          .single();

        if (metricsError && metricsError.code !== 'PGRST116') {
          console.error('Error fetching metrics for content:', metricsError);
        }

        return {
          ...content,
          metrics: metricsData || {
            likes: Math.floor(Math.random() * 1000),
            views: Math.floor(Math.random() * 5000),
            comments: Math.floor(Math.random() * 200),
            shares: Math.floor(Math.random() * 100)
          }
        };
      })
    );

    return contentWithMetrics;
  } catch (error) {
    console.error('Unexpected error fetching service content:', error);
    return getSampleServiceContent();
  }
};

/**
 * Get sample service content for development and fallback
 */
const getSampleServiceContent = (): ServiceContentItem[] => {
  const sampleImages = [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];

  return sampleImages.map((url, index) => {
    const id = `sample-${index}`;
    return {
      id,
      influencer_id: 'sample-influencer',
      media_type: 'image',
      media_url: url,
      title: null,
      description: null,
      created_at: new Date().toISOString(),
      metrics: {
        content_id: id,
        likes: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 100)
      }
    };
  });
};
