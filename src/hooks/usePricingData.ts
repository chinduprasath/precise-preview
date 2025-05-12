
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformService {
  id: string;
  influencer_id: string;
  platform: string;
  service_type: string;
  price: number;
  is_active: boolean;
}

export interface ComboPackage {
  id: string;
  influencer_id: string;
  name: string;
  description: string | null;
  platforms: string[];
  service_types?: string[];
  price: number;
  delivery_days?: number;
  is_featured: boolean;
  is_active: boolean;
}

export function usePricingData(influencerId?: string) {
  const [platformServices, setPlatformServices] = useState<PlatformService[]>([]);
  const [comboPackages, setComboPackages] = useState<ComboPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPricingData = async () => {
      try {
        setLoading(true);
        
        if (!influencerId) {
          throw new Error('Influencer ID is required');
        }

        // Fetch platform-specific services
        const { data: serviceData, error: serviceError } = await supabase
          .from('influencer_pricing')
          .select('*')
          .eq('influencer_id', influencerId)
          .eq('is_active', true);

        if (serviceError) throw serviceError;

        // Fetch combo packages
        const { data: packageData, error: packageError } = await supabase
          .from('influencer_packages')
          .select('*')
          .eq('influencer_id', influencerId)
          .eq('is_active', true);

        if (packageError) throw packageError;

        if (isMounted) {
          // Cast the data to the appropriate type
          const typedServiceData = serviceData?.map(item => ({
            id: item.id,
            influencer_id: item.influencer_id,
            platform: item.platform,
            service_type: item.service_type,
            price: item.price,
            is_active: item.is_active
          })) as PlatformService[] || [];
          
          const typedPackageData = packageData?.map(item => ({
            id: item.id,
            influencer_id: item.influencer_id,
            name: item.name,
            description: item.description,
            platforms: item.platforms || [],
            service_types: item.service_types || [],
            price: item.price,
            delivery_days: item.delivery_days || 3,
            is_featured: item.is_featured,
            is_active: item.is_active
          })) as ComboPackage[] || [];
          
          setPlatformServices(typedServiceData);
          setComboPackages(typedPackageData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        if (isMounted) {
          setError('Failed to load pricing data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPricingData();

    return () => {
      isMounted = false;
    };
  }, [influencerId]);

  return { platformServices, comboPackages, loading, error };
}
