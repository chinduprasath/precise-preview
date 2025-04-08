
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Heart, CreditCard, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PricesTabContentProps {
  influencerId?: string;
  influencerName: string;
  onEditPrices?: () => void;
}

interface ContentItem {
  id: string;
  image_url: string;
  likes: number;
  bookmarks: number;
  comments: number;
  price: number;
}

const PricesTabContent: React.FC<PricesTabContentProps> = ({
  influencerId,
  influencerName,
  onEditPrices
}) => {
  const { toast } = useToast();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContentItems() {
      if (!influencerId) return;
      
      setLoading(true);
      try {
        // Fetch content items from service_content table
        const { data: serviceContentData, error: serviceContentError } = await supabase
          .from('service_content')
          .select('*')
          .eq('influencer_id', influencerId);
        
        if (serviceContentError) throw serviceContentError;

        if (serviceContentData) {
          // For each content item, fetch its metrics
          const contentWithMetrics = await Promise.all(serviceContentData.map(async (content) => {
            const { data: metricsData, error: metricsError } = await supabase
              .from('service_content_metrics')
              .select('*')
              .eq('content_id', content.id)
              .single();
            
            if (metricsError && metricsError.code !== 'PGRST116') {
              console.error('Error fetching metrics:', metricsError);
            }

            return {
              id: content.id,
              image_url: content.media_url || 'https://picsum.photos/500/300',
              likes: metricsData?.likes || Math.floor(Math.random() * 500) * 1000,
              bookmarks: Math.floor(Math.random() * 500) * 1000, // Random data for demo
              comments: metricsData?.comments || Math.floor(Math.random() * 20) * 1000,
              price: Math.floor(Math.random() * 10) * 100 + 100 // Random price for demo
            };
          }));

          // If no content items are found, create sample data
          if (contentWithMetrics.length === 0) {
            const sampleContent = Array(4).fill(0).map((_, index) => ({
              id: `sample-${index}`,
              image_url: `https://picsum.photos/id/${index + 30}/500/300`,
              likes: Math.floor(Math.random() * 500) * 1000,
              bookmarks: Math.floor(Math.random() * 500) * 1000,
              comments: Math.floor(Math.random() * 20) * 1000,
              price: Math.floor(Math.random() * 10) * 100 + 100
            }));
            setContentItems(sampleContent);
          } else {
            setContentItems(contentWithMetrics);
          }
        }
      } catch (err) {
        console.error('Error fetching content items:', err);
        setError('Failed to load content items');
      } finally {
        setLoading(false);
      }
    }

    fetchContentItems();
  }, [influencerId]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden border border-gray-200">
            <Skeleton className="h-52 w-full" />
            <div className="p-3">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contentItems.map((item) => (
        <div key={item.id} className="rounded-lg overflow-hidden border border-gray-200">
          <div className="relative h-52 bg-gray-100">
            <img 
              src={item.image_url} 
              alt="Content" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://picsum.photos/500/300';
              }}
            />
          </div>
          <div className="p-3">
            <div className="flex justify-between items-center text-sm mb-2">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span>{formatNumber(item.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-amber-700">⊕</span>
                <span>{formatNumber(item.bookmarks)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <span className="font-medium">₹{item.price}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>{formatNumber(item.comments)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricesTabContent;
