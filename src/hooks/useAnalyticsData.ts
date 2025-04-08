
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InfluencerAnalytics {
  id: string;
  influencer_id: string;
  total_campaigns: number;
  avg_likes: number;
  avg_comments: number;
  avg_shares: number;
  avg_views: number;
  engagement_rate: number;
  fake_followers_percent: number;
}

export interface MonthlyAnalytics {
  id: string;
  influencer_id: string;
  month: number;
  year: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  orders: number;
  engagement_rate: number;
  earnings: number;
}

export function useAnalyticsData(influencerId?: string) {
  const [analytics, setAnalytics] = useState<InfluencerAnalytics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        if (!influencerId) {
          throw new Error('Influencer ID is required');
        }

        // Fetch general analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('influencer_analytics')
          .select('*')
          .eq('influencer_id', influencerId)
          .single();

        if (analyticsError && analyticsError.code !== 'PGRST116') {
          throw analyticsError;
        }

        // Fetch monthly analytics data for charts
        const { data: monthlyAnalyticsData, error: monthlyError } = await supabase
          .from('influencer_monthly_analytics')
          .select('*')
          .eq('influencer_id', influencerId)
          .order('year', { ascending: true })
          .order('month', { ascending: true });

        if (monthlyError) throw monthlyError;

        if (isMounted) {
          setAnalytics(analyticsData || null);
          setMonthlyData(monthlyAnalyticsData || []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        if (isMounted) {
          setError('Failed to load analytics data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalyticsData();

    return () => {
      isMounted = false;
    };
  }, [influencerId]);

  return { analytics, monthlyData, loading, error };
}
