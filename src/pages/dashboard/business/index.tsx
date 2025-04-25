import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, Search, Users, BarChart2, BadgeIndianRupee, 
  TrendingUp, Filter, CalendarDays
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ServiceRequests from '@/components/dashboard/ServiceRequests';
import { InfluencerRequest, RequestStatus } from '@/types/request';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BusinessDashboard = () => {
  const [requests, setRequests] = useState<InfluencerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [completedCampaigns, setCompletedCampaigns] = useState(0);
  const [totalReach, setTotalReach] = useState(0);
  const [activeRequests, setActiveRequests] = useState(0);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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
        
        // Fetch payments
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('amount, currency')
          .eq('business_id', user.id)
          .in('status', ['completed', 'processing']);
          
        if (paymentsError) {
          throw paymentsError;
        }
        
        // Fetch post metrics for reach calculation
        const { data: postMetrics, error: metricsError } = await supabase
          .from('posts')
          .select(`
            id,
            post_metrics(reach, impressions)
          `)
          .eq('business_id', user.id);
          
        if (metricsError) {
          throw metricsError;
        }
        
        // Transform the data to match our existing interface
        const formattedRequests: InfluencerRequest[] = orderRequests.map(request => {
          const influencerData = request.influencer_profiles;
          const firstName = influencerData?.user_profiles?.first_name || '';
          const lastName = influencerData?.user_profiles?.last_name || '';
          
          return {
            id: request.id,
            businessId: request.business_id || user.id,
            businessName: 'Your Business', // We could fetch this if needed
            influencerId: request.influencer_id,
            influencerName: `${firstName} ${lastName}`.trim(),
            influencerImage: influencerData?.user_profiles?.profile_image_url || 'https://picsum.photos/200/200',
            serviceType: request.service_type,
            platform: request.platform,
            price: request.price,
            currency: request.currency,
            status: request.status as RequestStatus,
            createdAt: new Date(request.created_at).toISOString(),
            updatedAt: new Date(request.updated_at).toISOString(),
            description: request.description
          };
        });
        
        // Calculate dashboard metrics
        const totalSpentValue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        const completedCount = orderRequests.filter(req => req.status === 'completed').length;
        
        // Calculate total reach from post metrics
        let totalReachValue = 0;
        postMetrics.forEach(post => {
          if (post.post_metrics && post.post_metrics.length > 0) {
            totalReachValue += post.post_metrics.reduce((sum, metric) => sum + (metric.reach || 0), 0);
          }
        });
        
        const activeRequestsCount = orderRequests.filter(
          req => req.status === 'pending' || req.status === 'approved'
        ).length;
        
        // Update state with fetched data
        setRequests(formattedRequests);
        setTotalSpent(totalSpentValue);
        setCompletedCampaigns(completedCount);
        setTotalReach(totalReachValue);
        setActiveRequests(activeRequestsCount);
        
        // Set up realtime subscription for order requests
        const channel = supabase
          .channel('business-dashboard-changes')
          .on('postgres_changes', {
            event: '*', 
            schema: 'public',
            table: 'order_requests',
            filter: `business_id=eq.${user.id}`
          }, (payload) => {
            // Refresh data when changes occur
            fetchDashboardData();
            
            // Show notification
            // Fix the type error by adding type checking
            if (payload.new && 'status' in payload.new && 
                payload.old && 'status' in payload.old && 
                payload.new.status !== payload.old.status) {
              toast(`Order status updated to: ${payload.new.status}`, {
                description: `Your order has been ${payload.new.status}`,
                duration: 5000,
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
          }, (payload) => {
            if (payload.new && typeof payload.new === 'object') {
              toast(
                (payload.new.title as string) || 'New notification', 
                {
                  description: (payload.new.message as string) || '',
                  duration: 5000,
                }
              );
            }
          })
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

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
        description: "Your payment has been processed successfully. The influencer has been notified.",
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
            description: "The influencer has published your content. View analytics in the Reach page.",
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
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ConditionalHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Business Dashboard</h1>
                <p className="text-gray-500">Manage your influencer marketing campaigns</p>
              </div>
              <Button className="md:w-auto w-full" onClick={() => navigate('/influencers')}>
                <Plus className="mr-2 h-4 w-4" /> Find Influencers
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Requests</p>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : activeRequests}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Campaigns</p>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : completedCampaigns}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Reach</p>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : totalReach > 0 
                        ? totalReach > 1000000 
                          ? `${(totalReach / 1000000).toFixed(1)}M` 
                          : totalReach > 1000 
                            ? `${(totalReach / 1000).toFixed(1)}K` 
                            : totalReach
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <BadgeIndianRupee className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">
                      {isLoading ? '...' : `₹${totalSpent.toLocaleString('en-IN')}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Service Requests</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                    View All Orders
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ServiceRequests 
                    requests={requests}
                    onPayRequest={handlePayRequest}
                  />
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Campaign Calendar</h2>
                  <Button variant="ghost" size="sm">
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests
                      .filter(req => req.status === 'paid' || req.status === 'completed')
                      .slice(0, 4)
                      .map((request) => (
                      <div key={request.id} className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="font-medium text-primary">
                            {new Date(request.updatedAt).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} with {request.influencerName}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>Platform: {request.platform.charAt(0).toUpperCase() + request.platform.slice(1)}</span>
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {requests.filter(req => req.status === 'paid' || req.status === 'completed').length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No active campaigns yet
                      </div>
                    )}
                  </div>
                )}
                
                <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/orders')}>
                  View All Orders
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Campaign Performance</h2>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{
                          i === 1 ? 'Spring Collection Campaign' : 'Product Launch'
                        }</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          i === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {i === 1 ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{
                        i === 1 
                          ? 'Campaign with 5 fashion influencers to promote spring collection.' 
                          : 'Product launch campaign with tech influencers.'
                      }</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Engagement</p>
                          <p className="font-semibold">{i === 1 ? '4.5%' : '3.8%'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Impressions</p>
                          <p className="font-semibold">{i === 1 ? '1.2M' : '780K'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="font-semibold">{i === 1 ? '24K' : '15K'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="font-semibold">{i === 1 ? '2.3K' : '1.1K'}</p>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">View Full Report</Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Spring Collection Campaign</p>
                      <p className="text-sm font-medium">₹5,000 / ₹5,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Product Launch</p>
                      <p className="text-sm font-medium">₹7,200 / ₹10,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm">Summer Campaign (Planned)</p>
                      <p className="text-sm font-medium">₹0 / ₹8,000</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Total Budget</p>
                      <p className="font-medium">₹23,000</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>Used</p>
                      <p>₹12,200 (53.0%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboard;
