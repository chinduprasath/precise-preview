
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Hashtag } from '@/types/location';
import { useToast } from '@/components/ui/use-toast';

export function useHashtags() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchHashtags() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hashtags')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setHashtags(data as Hashtag[]);
      } catch (error) {
        console.error('Error fetching hashtags:', error);
        toast({
          title: 'Error',
          description: 'Failed to load hashtags',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHashtags();
  }, [toast]);

  const addHashtag = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      // Check if hashtag already exists
      let hashtagId;
      const existingHashtag = hashtags.find(h => h.name.toLowerCase() === name.toLowerCase());
      
      if (existingHashtag) {
        hashtagId = existingHashtag.id;
      } else {
        // Create new hashtag
        const { data, error } = await supabase
          .from('hashtags')
          .insert({ name: name.toLowerCase() })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        // Cast to ensure type safety
        const newHashtag = data as Hashtag;
        hashtagId = newHashtag.id;
        
        // Update local hashtags state
        setHashtags([...hashtags, newHashtag]);
      }
      
      // Add to selected hashtags if not already selected
      if (!selectedHashtags.includes(name.toLowerCase())) {
        setSelectedHashtags([...selectedHashtags, name.toLowerCase()]);
      }
      
    } catch (error) {
      console.error('Error adding hashtag:', error);
      toast({
        title: 'Error',
        description: 'Failed to add hashtag',
        variant: 'destructive',
      });
    }
  };

  return {
    hashtags,
    selectedHashtags,
    setSelectedHashtags,
    addHashtag,
    loading
  };
}
