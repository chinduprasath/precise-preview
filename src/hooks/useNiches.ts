
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Niche } from '@/types/location';
import { useToast } from '@/components/ui/use-toast';

export function useNiches() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchNiches() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('niches')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setNiches(data as Niche[]);
      } catch (error) {
        console.error('Error fetching niches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load niches',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchNiches();
  }, [toast]);

  return {
    niches,
    selectedNiche,
    setSelectedNiche,
    loading
  };
}
