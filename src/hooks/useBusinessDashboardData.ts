import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { InfluencerRequest, RequestStatus, ServiceType } from '@/types/request';
import { toast } from 'sonner';

interface DashboardData {
  totalSpent: number;
  completedCampaigns: number;
  totalReach: number;
  activeRequests: number;
  totalOrders: number;
  connectedInfluencers: number;
  impactScore: number;
  postStats: {
    total: number;
    reels: number;
    videos: number;
    shorts: number;
  };
}

export const useBusinessDashboardData = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSpent: 0,
    completedCampaigns: 0,
    totalReach: 0,
    activeRequests: 0,
    totalOrders: 0,
    connectedInfluencers: 0,
    impactScore: 0,
    postStats: {
      total: 0,
      reels: 0,
      videos: 0,
      shorts: 0
    }
  });
  
  // Mock data for the components
  const [topPerformedOrders, setTopPerformedOrders] = useState([{
    id: '1',
    title: 'Summer Collection',
    platforms: ['Instagram', 'Facebook'],
    serviceTypes: ['reel', 'story'],
    performanceScore: 95,
    engagement: 9.2,
    reach: 65000
  }, {
    id: '2',
    title: 'Product Launch',
    platforms: ['Youtube'],
    serviceTypes: ['video'],
    performanceScore: 89,
    engagement: 7.5,
    reach: 48000
  }, {
    id: '3',
    title: 'Brand Promotion',
    platforms: ['Instagram', 'Twitter'],
    serviceTypes: ['post', 'reel'],
    performanceScore: 82,
    engagement: 6.7,
    reach: 35000
  }, {
    id: '4',
    title: 'Tutorial Series',
    platforms: ['Facebook', 'Youtube'],
    serviceTypes: ['video', 'short'],
    performanceScore: 78,
    engagement: 5.4,
    reach: 28000
  }, {
    id: '5',
    title: 'Brand Partnership',
    platforms: ['Twitter'],
    serviceTypes: ['post'],
    performanceScore: 75,
    engagement: 4.9,
    reach: 22000
  }]);
  
  const [topInfluencers, setTopInfluencers] = useState([{
    id: '1',
    name: 'Priya Sharma',
    username: 'priyasharma',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    ordersCount: 24
  }, {
    id: '2',
    name: 'Raj Malhotra',
    username: 'rajmalhotra',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    ordersCount: 21
  }, {
    id: '3',
    name: 'Aisha Khan',
    username: 'aishakhan',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    ordersCount: 18
  }, {
    id: '4',
    name: 'Vikram Patel',
    username: 'vikrampatel',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    ordersCount: 15
  }, {
    id: '5',
    name: 'Neha Singh',
    username: 'nehasingh',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200',
    ordersCount: 13
  }]);
  
  const [topBusinessUsers, setTopBusinessUsers] = useState([{
    id: '1',
    name: 'Fashion Forward',
    username: 'fashionforward',
    profileImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=200',
    ordersCount: 28
  }, {
    id: '2',
    name: 'Tech Haven',
    username: 'techhaven',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200',
    ordersCount: 24
  }, {
    id: '3',
    name: 'Beauty Essentials',
    username: 'beautyessentials',
    profileImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200',
    ordersCount: 20
  }, {
    id: '4',
    name: 'Health First',
    username: 'healthfirst',
    profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=200',
    ordersCount: 16
  }, {
    id: '5',
    name: 'Fitness Hub',
    username: 'fitnesshub',
    profileImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200',
    ordersCount: 14
  }]);
  
  const [pendingOrders, setPendingOrders] = useState([{
    id: '1',
    title: 'Influencer Campaign - Summer',
    influencerName: 'Priya Sharma',
    platforms: ['Instagram', 'Youtube'],
    serviceTypes: ['reel', 'video'],
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  }, {
    id: '2',
    title: 'Product Launch - Spring',
    influencerName: 'Raj Malhotra',
    platforms: ['Facebook'],
    serviceTypes: ['post'],
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  }, {
    id: '3',
    title: 'Brand Awareness - Winter',
    influencerName: 'Aisha Khan',
    platforms: ['Twitter', 'Instagram'],
    serviceTypes: ['story', 'post'],
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString()
  }, {
    id: '4',
    title: 'Engagement Boost - Autumn',
    influencerName: 'Vikram Patel',
    platforms: ['Youtube'],
    serviceTypes: ['short'],
    status: 'awaiting',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  }]);
  
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const calculateImpactScore = (
    engagementRate: number,
    reach: number,
    consistency: number,
    platformDiversity: number,
    orderCompletionRate: number
  ) => {
    // Ensure all inputs are valid numbers, defaulting to 0 if NaN
    const safeEngagementRate = isNaN(engagementRate) ? 0 : Math.min(engagementRate, 100);
    const safeReach = isNaN(reach) ? 0 : Math.min(reach, 100);
    const safeConsistency = isNaN(consistency) ? 0 : Math.min(consistency, 100);
    const safePlatformDiversity = isNaN(platformDiversity) ? 0 : Math.min(platformDiversity, 100);
    const safeOrderCompletionRate = isNaN(orderCompletionRate) ? 0 : Math.min(orderCompletionRate, 100);

    return Math.round(
      (safeEngagementRate * 0.35) +
      (safeReach * 0.25) +
      (safeConsistency * 0.15) +
      (safePlatformDiversity * 0.10) +
      (safeOrderCompletionRate * 0.15)
    );
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch order requests for this business
      const { data: orderRequests, error: requestsError } = await supabase
        .from('order_requests')
        .select(`
          id,
          service_type,
          platform,
          price,
          currency,
          status,
          description,
          created_at,
          updated_at,
          influencer_id,
          business_id,
          influencer_profiles:influencer_id(id, user_profiles(first_name, last_name, profile_image_url))
        `)
        .eq('business_id', user.id)
        .order('created_at', { ascending: false });
      
      if (requestsError) {
        throw requestsError;
      }

      // Fetch post metrics for reach and engagement calculation
      const { data: postMetrics, error: metricsError } = await supabase
        .from('posts')
        .select(`
          id,
          post_type,
          post_metrics(reach, impressions, engagement_rate)
        `)
        .eq('business_id', user.id);
      
      if (metricsError) {
        throw metricsError;
      }

      // Calculate metrics
      const totalSpentValue = orderRequests.reduce((sum, req) => sum + (req.price || 0), 0);
      const completedCount = orderRequests.filter(req => req.status === 'completed').length;
      const totalOrdersCount = orderRequests.length;
      const activeRequestsCount = orderRequests.filter(req => req.status === 'pending' || req.status === 'approved').length;

      // Calculate unique influencers
      const uniqueInfluencers = new Set();
      orderRequests.forEach(req => {
        if (req.influencer_id) {
          uniqueInfluencers.add(req.influencer_id);
        }
      });
      const connectedInfluencersCount = uniqueInfluencers.size;

      // Calculate content type counts
      const postTypes = {
        total: postMetrics.length,
        reels: postMetrics.filter(post => post.post_type === 'reel').length,
        videos: postMetrics.filter(post => post.post_type === 'video').length,
        shorts: postMetrics.filter(post => post.post_type === 'short').length
      };

      // Calculate total reach
      let totalReachValue = 0;
      postMetrics.forEach(post => {
        if (post.post_metrics && post.post_metrics.length > 0) {
          totalReachValue += post.post_metrics.reduce((sum, metric) => sum + (metric.reach || 0), 0);
        }
      });

      // Calculate impact score components
      const avgEngagementRate = postMetrics.length > 0 
        ? postMetrics.reduce((sum, post) => {
            if (post.post_metrics && post.post_metrics.length > 0) {
              return sum + post.post_metrics.reduce((metricSum, metric) => metricSum + (metric.engagement_rate || 0), 0);
            }
            return sum;
          }, 0) / postMetrics.length
        : 0;

      const reachScore = totalReachValue > 0 
        ? Math.min((totalReachValue / 100000) * 100, 100) 
        : 0;

      const consistencyScore = totalOrdersCount > 0 
        ? (completedCount / totalOrdersCount) * 100 
        : 0;

      const platformDiversityScore = Math.min((Object.keys(postTypes).length / 4) * 100, 100);

      const orderCompletionScore = totalOrdersCount > 0 
        ? (completedCount / totalOrdersCount) * 100 
        : 0;

      const impactScore = calculateImpactScore(
        avgEngagementRate,
        reachScore,
        consistencyScore,
        platformDiversityScore,
        orderCompletionScore
      );

      // Ensure impactScore is a valid number
      const finalImpactScore = isNaN(impactScore) ? 0 : impactScore;

      // Transform the data to match our existing interface
      const formattedRequests: InfluencerRequest[] = orderRequests.map(request => {
        const influencerData = request.influencer_profiles;
        const firstName = influencerData?.user_profiles?.first_name || '';
        const lastName = influencerData?.user_profiles?.last_name || '';
        
        return {
          id: request.id,
          businessId: request.business_id || user.id,
          businessName: 'Your Business',  // We could fetch this if needed
          influencerId: request.influencer_id,
          influencerName: `${firstName} ${lastName}`.trim(),
          influencerImage: influencerData?.user_profiles?.profile_image_url || 'https://picsum.photos/200/200',
          serviceType: request.service_type as ServiceType,
          platform: request.platform,
          price: request.price,
          currency: request.currency,
          status: request.status as RequestStatus,
          createdAt: new Date(request.created_at).toISOString(),
          updatedAt: new Date(request.updated_at).toISOString(),
          description: request.description
        };
      });

      // Update state with fetched data
      setRequests(formattedRequests);
      setDashboardData({
        totalSpent: totalSpentValue,
        completedCampaigns: completedCount,
        totalReach: totalReachValue,
        activeRequests: activeRequestsCount,
        totalOrders: totalOrdersCount,
        connectedInfluencers: connectedInfluencersCount,
        impactScore: finalImpactScore,
        postStats: postTypes
      });

      // Set up realtime subscription for order requests
      const channel = supabase
        .channel('business-dashboard-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'order_requests',
          filter: `business_id=eq.${user.id}`
        }, payload => {
          // Refresh data when changes occur
          fetchDashboardData();

          // Show notification
          if (payload.new && 'status' in payload.new && payload.old && 'status' in payload.old && payload.new.status !== payload.old.status) {
            toast(`Order status updated to: ${payload.new.status}`, {
              description: `Your order has been ${payload.new.status}`,
              duration: 5000
            });
          }
        })
        .subscribe();

      // Also listen for notifications
      supabase
        .channel('business-notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, payload => {
          if (payload.new && typeof payload.new === 'object') {
            toast(payload.new.title as string || 'New notification', {
              description: payload.new.message as string || '',
              duration: 5000
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayRequest = async (requestId: string) => {
    try {
      // First get the request details
      const { data: request, error: requestError } = await supabase
        .from('order_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (requestError) throw requestError;

      // Update request status to paid
      const { error: updateError } = await supabase
        .from('order_requests')
        .update({ status: 'paid' })
        .eq('id', requestId);
      
      if (updateError) throw updateError;

      // Create payment record
      const { data: userData } = await supabase.auth.getUser();
      const platformFee = request.price * 0.10; // 10% platform fee

      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: requestId,
          business_id: userData.user?.id,
          influencer_id: request.influencer_id,
          amount: request.price,
          currency: request.currency,
          platform_fee: platformFee,
          total_amount: request.price + platformFee,
          status: 'completed',
          payment_date: new Date().toISOString(),
          payment_method: 'card',
          transaction_id: `tr_${Math.random().toString(36).substring(2, 15)}`
        });
      
      if (paymentError) throw paymentError;

      // Show success message
      uiToast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully. The influencer has been notified."
      });

      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: 'paid' as RequestStatus, updatedAt: new Date().toISOString() } 
            : request
        )
      );

      // After a delay, simulate the influencer completing the order
      setTimeout(async () => {
        const { error: completeError } = await supabase
          .from('order_requests')
          .update({ status: 'completed' })
          .eq('id', requestId);
        
        if (!completeError) {
          // Create a post record
          await supabase
            .from('posts')
            .insert({
              order_id: requestId,
              influencer_id: request.influencer_id,
              business_id: userData.user?.id,
              platform: request.platform,
              post_type: request.service_type,
              content: request.description,
              status: 'published',
              published_time: new Date().toISOString(),
              is_approved: true
            });
          
          uiToast({
            title: "Campaign Completed",
            description: "The influencer has published your content. View analytics in the Reach page."
          });

          // Update local state
          setRequests(prevRequests => 
            prevRequests.map(req => 
              req.id === requestId 
                ? { ...req, status: 'completed' as RequestStatus, updatedAt: new Date().toISOString() } 
                : req
            )
          );
        }
      }, 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      uiToast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewOrder = (orderId: string) => {
    uiToast({
      title: "Order Details",
      description: `Viewing details for order ${orderId}`
    });
    // In a real app, navigate to order details page or show a modal
  };

  return {
    isLoading,
    dashboardData,
    requests,
    topPerformedOrders,
    topInfluencers,
    topBusinessUsers,
    pendingOrders,
    handlePayRequest,
    handleViewOrder
  };
};
