// Define the content item type
export interface ServiceContentItem {
  id: string;
  influencer_id: string;
  media_url: string;
  media_type: 'image' | 'video' | 'poll'; // Explicitly define media types
  platforms: ('instagram' | 'facebook' | 'youtube' | 'twitter')[]; // Array of platforms
  title?: string;
  description?: string;
  created_at?: string;
  metrics: {
    likes: number;
    views: number;
    comments: number;
    shares: number;
  };
}

// Demo content items for testing
const demoItems: ServiceContentItem[] = [
  {
    id: '1',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2050&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['instagram', 'facebook'],
    title: 'Instagram Fashion Post',
    description: 'Summer collection highlight',
    created_at: new Date().toISOString(),
    metrics: { likes: 200000, views: 500000, comments: 500, shares: 10000 }
  },
  {
    id: '2',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1561664089-8cc4201eba91?q=80&w=2070&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['youtube'],
    title: 'Product Review',
    description: 'Latest tech gadget review',
    created_at: new Date().toISOString(),
    metrics: { likes: 180000, views: 450000, comments: 720, shares: 8500 }
  },
  {
    id: '3',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1672262277543-322fa9898d0a?q=80&w=2070&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['twitter'],
    title: 'Travel Vlog',
    description: 'Exploring hidden gems',
    created_at: new Date().toISOString(),
    metrics: { likes: 220000, views: 600000, comments: 950, shares: 12000 }
  },
  {
    id: '4',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1560463315-6b0914461698?q=80&w=2066&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['instagram', 'facebook'],
    title: 'Fitness Challenge',
    description: '30-day transformation',
    created_at: new Date().toISOString(),
    metrics: { likes: 195000, views: 520000, comments: 830, shares: 9200 }
  },
  {
    id: '5',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1974&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['instagram'],
    title: 'Cooking Tutorial',
    description: 'Easy 5-minute recipes',
    created_at: new Date().toISOString(),
    metrics: { likes: 178000, views: 480000, comments: 650, shares: 8800 }
  },
  {
    id: '6',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2076&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['facebook'],
    title: 'Style Haul',
    description: 'Winter fashion trends',
    created_at: new Date().toISOString(),
    metrics: { likes: 210000, views: 540000, comments: 780, shares: 9500 }
  },
  {
    id: '7',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1513384312027-9fa69a360337?q=80&w=2071&auto=format&fit=crop',
    media_type: 'image',
    platforms: ['instagram', 'twitter'],
    title: 'Makeup Tutorial',
    description: 'Natural everyday look',
    created_at: new Date().toISOString(),
    metrics: { likes: 205000, views: 530000, comments: 870, shares: 11000 }
  },
  {
    id: '8',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080&auto=format&fit=crop',
    media_type: 'video',
    platforms: ['youtube', 'facebook'],
    title: 'Gaming Stream',
    description: 'Gameplay highlights',
    created_at: new Date().toISOString(),
    metrics: { likes: 189000, views: 510000, comments: 920, shares: 7800 }
  },
  {
    id: '9',
    influencer_id: 'demo',
    media_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1980&auto=format&fit=crop',
    media_type: 'poll',
    platforms: ['instagram'],
    title: 'Music Cover Poll',
    description: 'Which song next?',
    created_at: new Date().toISOString(),
    metrics: { likes: 215000, views: 550000, comments: 980, shares: 12500 }
  }
];

// Function to fetch service content
export async function fetchServiceContent(influencerId?: string): Promise<ServiceContentItem[]> {
  // In a real app, we would fetch from an API using the influencerId
  // For now, return demo content
  return new Promise((resolve) => {
    setTimeout(() => {
      // If we have an influencerId, update the demo items to use it
      if (influencerId) {
        const items = demoItems.map(item => ({
          ...item,
          influencer_id: influencerId
        }));
        resolve(items);
      } else {
        resolve(demoItems);
      }
    }, 1000);
  });
}
