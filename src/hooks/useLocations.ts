
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Country, State, City } from '@/types/location';
import { useToast } from '@/components/ui/use-toast';

export function useLocations() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('countries')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setCountries(data || []);
        
        // Auto-select India since it's the only country option as per requirements
        if (data && data.length > 0) {
          const india = data.find(c => c.name === 'India');
          if (india) {
            setSelectedCountry(india.id.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load countries',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, [toast]);

  useEffect(() => {
    async function fetchStates() {
      if (!selectedCountry) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('states')
          .select('*')
          .eq('country_id', parseInt(selectedCountry))
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setStates(data || []);
        setSelectedState('');
        setCities([]);
      } catch (error) {
        console.error('Error fetching states:', error);
        toast({
          title: 'Error',
          description: 'Failed to load states',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStates();
  }, [selectedCountry, toast]);

  useEffect(() => {
    async function fetchCities() {
      if (!selectedState) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('state_id', parseInt(selectedState))
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setCities(data || []);
        setSelectedCity('');
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load cities',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, [selectedState, toast]);

  return {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
    loading
  };
}
