
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
  service_types: string[];
  price: number;
  delivery_days: number;
  is_featured: boolean;
  is_active: boolean;
}

export type PlatformPricing = {
  [platform: string]: {
    [serviceType: string]: number | null;
  }
};

export function usePricingData(influencerId?: string) {
  const [platformServices, setPlatformServices] = useState<PlatformService[]>([]);
  const [comboPackages, setComboPackages] = useState<ComboPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformPricing, setPlatformPricing] = useState<PlatformPricing>({});

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
          
          // Process the platform pricing into a structured format for the table
          const pricing: PlatformPricing = {};
          typedServiceData.forEach(service => {
            if (!pricing[service.platform]) {
              pricing[service.platform] = {};
            }
            pricing[service.platform][service.service_type] = service.price;
          });
          
          // Convert package data with default values for new fields
          const typedPackageData = packageData?.map(item => ({
            id: item.id,
            influencer_id: item.influencer_id,
            name: item.name,
            description: item.description,
            platforms: item.platforms || [],
            service_types: item.service_types || [],
            delivery_days: item.delivery_days || 3,
            price: item.price,
            is_featured: item.is_featured || false,
            is_active: item.is_active
          })) as ComboPackage[] || [];
          
          setPlatformServices(typedServiceData);
          setPlatformPricing(pricing);
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

  const updatePlatformPrice = async (platform: string, serviceType: string, price: number | null) => {
    try {
      if (!influencerId) return;
      
      // Update local state first for immediate feedback
      setPlatformPricing(prev => ({
        ...prev,
        [platform]: {
          ...(prev[platform] || {}),
          [serviceType]: price
        }
      }));

      // Find existing service or create new one
      const existingService = platformServices.find(
        service => service.platform === platform && service.service_type === serviceType
      );

      if (existingService) {
        // Update existing service
        const { error } = await supabase
          .from('influencer_pricing')
          .update({ price: price })
          .eq('id', existingService.id);
          
        if (error) throw error;
      } else if (price !== null) {
        // Create new service only if price is not null
        const { error } = await supabase
          .from('influencer_pricing')
          .insert({
            influencer_id: influencerId,
            platform,
            service_type: serviceType,
            price,
            is_active: true
          });
          
        if (error) throw error;
      }
      
      // Reload data to ensure consistency
      const { data, error } = await supabase
        .from('influencer_pricing')
        .select('*')
        .eq('influencer_id', influencerId)
        .eq('is_active', true);
        
      if (error) throw error;
      
      const updatedServices = data?.map(item => ({
        id: item.id,
        influencer_id: item.influencer_id,
        platform: item.platform,
        service_type: item.service_type,
        price: item.price,
        is_active: item.is_active
      })) as PlatformService[] || [];
      
      setPlatformServices(updatedServices);
      
    } catch (err) {
      console.error('Error updating price:', err);
      // Revert local state on error
      // We would need to re-fetch the data here
    }
  };

  const savePackage = async (packageData: Omit<ComboPackage, 'id' | 'influencer_id' | 'is_active'>) => {
    try {
      if (!influencerId) return null;
      
      const newPackage = {
        ...packageData,
        influencer_id: influencerId,
        is_active: true
      };
      
      const { data, error } = await supabase
        .from('influencer_packages')
        .insert(newPackage)
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state with the new package
      setComboPackages(prev => [...prev, data as ComboPackage]);
      
      return data;
    } catch (err) {
      console.error('Error saving package:', err);
      return null;
    }
  };

  const updatePackage = async (id: string, packageData: Partial<ComboPackage>) => {
    try {
      const { error } = await supabase
        .from('influencer_packages')
        .update(packageData)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setComboPackages(prev => 
        prev.map(pkg => pkg.id === id ? { ...pkg, ...packageData } : pkg)
      );
      
      return true;
    } catch (err) {
      console.error('Error updating package:', err);
      return false;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('influencer_packages')
        .update({ is_active: false })
        .eq('id', id);
        
      if (error) throw error;
      
      // Remove from local state
      setComboPackages(prev => prev.filter(pkg => pkg.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting package:', err);
      return false;
    }
  };

  return { 
    platformServices, 
    comboPackages, 
    platformPricing,
    loading, 
    error,
    updatePlatformPrice,
    savePackage,
    updatePackage,
    deletePackage
  };
}
