
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Influencer, Hashtag } from '@/types/location';
import { useToast } from '@/components/ui/use-toast';

export interface InfluencerFilters {
  countryId?: number;
  stateId?: number;
  cityId?: number;
  nicheId?: number;
  hashtags?: string[];
  followerRange?: [number, number];
  engagementRange?: [number, number];
}

export function useInfluencers(filters: InfluencerFilters = {}) {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInfluencers() {
      try {
        // Only show loading indicator on initial load
        if (isInitialLoad) {
          setLoading(true);
        }
        
        let query = supabase
          .from('influencers')
          .select(`
            *,
            country:countries(*),
            state:states(*),
            city:cities(*),
            niche:niches(*)
          `);
        
        // Apply filters
        if (filters.countryId) {
          query = query.eq('country_id', filters.countryId);
        }
        
        if (filters.stateId) {
          query = query.eq('state_id', filters.stateId);
        }
        
        if (filters.cityId) {
          query = query.eq('city_id', filters.cityId);
        }
        
        if (filters.nicheId) {
          query = query.eq('niche_id', filters.nicheId);
        }
        
        if (filters.followerRange) {
          query = query.gte('followers_instagram', filters.followerRange[0])
                       .lte('followers_instagram', filters.followerRange[1]);
        }
        
        if (filters.engagementRange) {
          query = query.gte('engagement_rate', filters.engagementRange[0])
                       .lte('engagement_rate', filters.engagementRange[1]);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) {
          throw error;
        }
        
        // Type assertion with proper handling of the nested data structure
        let influencersList = (data || []).map(item => ({
          ...item,
          // Ensure city has proper structure if it exists
          city: item.city ? {
            id: item.city.id,
            name: item.city.name,
            state_id: item.city.state_id,
            country_id: (item.city as any).country_id || item.country_id || 0
          } : undefined
        })) as Influencer[];
        
        // If hashtag filter is applied, fetch influencer hashtags and filter
        if (filters.hashtags && filters.hashtags.length > 0) {
          const hashtagsData = await Promise.all(
            influencersList.map(async (influencer) => {
              const { data: hashtagData } = await supabase
                .from('influencer_hashtags')
                .select(`
                  hashtag_id,
                  hashtags:hashtags(id, name)
                `)
                .eq('influencer_id', influencer.id);
                
              // Cast to ensure type safety
              const hashtags = hashtagData ? hashtagData.map(h => ({
                id: h.hashtag_id,
                name: h.hashtags?.name
              })) as Hashtag[] : [];
              
              return {
                ...influencer,
                hashtags
              };
            })
          );
          
          // Filter influencers with matching hashtags
          influencersList = hashtagsData.filter(influencer => 
            influencer.hashtags && influencer.hashtags.some(tag => 
              filters.hashtags?.includes(tag.name)
            )
          );
        }
        
        setInfluencers(influencersList);
        
        // Reset selected influencer if it's no longer in the filtered list
        if (selectedInfluencer && !influencersList.some(i => i.id === selectedInfluencer.id)) {
          setSelectedInfluencer(null);
        }
      } catch (error) {
        console.error('Error fetching influencers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load influencers',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }

    fetchInfluencers();
  }, [filters, toast, selectedInfluencer?.id]);

  return {
    influencers,
    selectedInfluencer,
    setSelectedInfluencer,
    loading,
    isInitialLoad
  };
}
