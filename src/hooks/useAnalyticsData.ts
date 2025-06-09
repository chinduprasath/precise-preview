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
  avg_reach: number;
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
          if (analyticsData) {
            // Type casting for analytics data
            const typedAnalytics: InfluencerAnalytics = {
              id: (analyticsData as any).id,
              influencer_id: (analyticsData as any).influencer_id,
              total_campaigns: (analyticsData as any).total_campaigns || 0,
              avg_likes: (analyticsData as any).avg_likes || 0,
              avg_comments: (analyticsData as any).avg_comments || 0,
              avg_shares: (analyticsData as any).avg_shares || 0,
              avg_views: (analyticsData as any).avg_views || 0,
              avg_reach: (analyticsData as any).avg_reach || 0,
              engagement_rate: (analyticsData as any).engagement_rate || 0,
              fake_followers_percent: (analyticsData as any).fake_followers_percent || 0
            };
            setAnalytics(typedAnalytics);
          } else {
            setAnalytics(null);
          }

          // Type casting for monthly analytics data
          const typedMonthlyData: MonthlyAnalytics[] = monthlyAnalyticsData 
            ? monthlyAnalyticsData.map(item => ({
                id: item.id,
                influencer_id: item.influencer_id,
                month: item.month,
                year: item.year,
                likes: item.likes || 0,
                comments: item.comments || 0,
                shares: item.shares || 0,
                views: item.views || 0,
                orders: item.orders || 0,
                engagement_rate: item.engagement_rate || 0,
                earnings: item.earnings || 0
              }))
            : [];
          
          setMonthlyData(typedMonthlyData);
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
