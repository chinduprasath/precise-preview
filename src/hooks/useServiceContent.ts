
import { useState, useEffect } from 'react';
import { ServiceContentItem, fetchServiceContent } from '@/components/influencers/utils/serviceContentUtils';

export function useServiceContent(influencerId?: string) {
  const [contentItems, setContentItems] = useState<ServiceContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        const content = await fetchServiceContent(influencerId);
        
        if (isMounted) {
          setContentItems(content);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading service content:', err);
          setError('Failed to load content');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [influencerId]);

  return { contentItems, loading, error };
}
