export interface BusinessUserMediaItem {
  id: string;
  title: string;
  media_url: string;
  media_type?: 'image' | 'video';
  platforms: ('instagram' | 'facebook' | 'youtube' | 'twitter')[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface BusinessUser {
  id: string;
  name: string;
  handle: string;
  company_name: string;
  category: string;
  description: string;
  avatar_url: string;
  cover_url?: string;
  website?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  followers: {
    instagram?: number;
    facebook?: number;
    twitter?: number;
    youtube?: number;
  };
  business_status?: 'registered' | 'not_registered';
  service_type?: 'online' | 'offline' | 'both';
  total_orders?: number;
  metrics: {
    total_campaigns: number;
    active_collaborations: number;
    avg_likes: number;
    avg_views: number;
    avg_reach: number;
    engagement_rate: number;
    avg_comments: number;
    avg_shares: number;
    budget_range: string;
    impact_score: number;
  };
  services: BusinessUserMediaItem[];
  gallery: BusinessUserMediaItem[];
}

export const MOCK_BUSINESS_USERS: BusinessUser[] = [
  {
    id: 'biz-1',
    name: 'Velocity Auto Club',
    handle: 'velocity_motors',
    company_name: 'Velocity Motors Ltd.',
    category: 'Automotive & Luxury',
    description: 'Premier automotive brand organizing high-profile driving experiences, test drives, and luxury automotive media collaborations worldwide.',
    avatar_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=200',
    cover_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200',
    website: 'https://velocitymotors.example.com',
    business_status: 'registered',
    service_type: 'both',
    total_orders: 142,
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    followers: {
      instagram: 450000,
      facebook: 210000,
      twitter: 95000,
      youtube: 350000
    },
    metrics: {
      total_campaigns: 142,
      active_collaborations: 18,
      avg_likes: 2450,
      avg_views: 68000,
      avg_reach: 520000,
      engagement_rate: 6.8,
      avg_comments: 310,
      avg_shares: 180,
      budget_range: '$2,500 - $15,000',
      impact_score: 94
    },
    services: [
      {
        id: 'srv-1',
        title: 'Desert Off-Road Expedition Promo',
        media_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram', 'facebook'],
        metrics: {
          likes: 200,
          comments: 50,
          shares: 10,
          views: 500
        }
      },
      {
        id: 'srv-2',
        title: 'Track Performance Studio Showcase',
        media_url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800',
        media_type: 'video',
        platforms: ['youtube'],
        metrics: {
          likes: 350,
          comments: 70,
          shares: 30,
          views: 900
        }
      },
      {
        id: 'srv-3',
        title: 'Aerodynamic Supercar Hillside Shoot',
        media_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram'],
        metrics: {
          likes: 180,
          comments: 40,
          shares: 15,
          views: 450
        }
      },
      {
        id: 'srv-4',
        title: 'Heritage Classic Cars Exhibition',
        media_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
        media_type: 'image',
        platforms: ['facebook', 'youtube'],
        metrics: {
          likes: 420,
          comments: 65,
          shares: 45,
          views: 1200
        }
      },
      {
        id: 'srv-5',
        title: 'Drivers Lounge & Coffee Stories',
        media_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram', 'youtube'],
        metrics: {
          likes: 290,
          comments: 38,
          shares: 22,
          views: 780
        }
      },
      {
        id: 'srv-6',
        title: 'Behind The Lens Trackday Coverage',
        media_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
        media_type: 'image',
        platforms: ['facebook'],
        metrics: {
          likes: 310,
          comments: 52,
          shares: 18,
          views: 860
        }
      }
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Sunset Coastway Rally',
        media_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram'],
        metrics: {
          likes: 540,
          comments: 89,
          shares: 34,
          views: 1450
        }
      },
      {
        id: 'gal-2',
        title: 'Night Speed Cinematic',
        media_url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800',
        media_type: 'video',
        platforms: ['youtube', 'instagram'],
        metrics: {
          likes: 820,
          comments: 110,
          shares: 64,
          views: 2900
        }
      },
      {
        id: 'gal-3',
        title: 'Red Rock Canyon Caravan',
        media_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800',
        media_type: 'image',
        platforms: ['facebook', 'instagram'],
        metrics: {
          likes: 410,
          comments: 48,
          shares: 25,
          views: 1150
        }
      }
    ]
  },
  {
    id: 'biz-2',
    name: 'Artisan Brews & Bites',
    handle: 'foodie_collective',
    company_name: 'Artisan Gourmet Brands',
    category: 'Food & Beverage',
    description: 'Specialty cafe chain and artisanal pantry products partnering with food critics, creators, and lifestyle influencers.',
    avatar_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200',
    cover_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200',
    website: 'https://artisanbrews.example.com',
    business_status: 'registered',
    service_type: 'offline',
    total_orders: 88,
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India'
    },
    followers: {
      instagram: 320000,
      facebook: 150000,
      twitter: 45000,
      youtube: 200000
    },
    metrics: {
      total_campaigns: 88,
      active_collaborations: 12,
      avg_likes: 1850,
      avg_views: 42000,
      avg_reach: 380000,
      engagement_rate: 7.2,
      avg_comments: 240,
      avg_shares: 115,
      budget_range: '$1,000 - $6,500',
      impact_score: 91
    },
    services: [
      {
        id: 'srv-21',
        title: 'Morning Roast Flatlay Campaign',
        media_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram', 'facebook'],
        metrics: {
          likes: 310,
          comments: 65,
          shares: 20,
          views: 920
        }
      },
      {
        id: 'srv-22',
        title: 'Masterclass Chef Recipe Reel',
        media_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800',
        media_type: 'video',
        platforms: ['youtube', 'instagram'],
        metrics: {
          likes: 480,
          comments: 92,
          shares: 55,
          views: 1850
        }
      },
      {
        id: 'srv-23',
        title: 'Sunday Brunch Table Story',
        media_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram'],
        metrics: {
          likes: 240,
          comments: 38,
          shares: 12,
          views: 710
        }
      }
    ],
    gallery: [
      {
        id: 'gal-21',
        title: 'Signature Pour & Crema',
        media_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram'],
        metrics: {
          likes: 390,
          comments: 54,
          shares: 18,
          views: 980
        }
      }
    ]
  },
  {
    id: 'biz-3',
    name: 'Aura Active Wear',
    handle: 'fitness_aura',
    company_name: 'Aura Athletic Corp',
    category: 'Fitness & Health',
    description: 'High-performance athletic apparel, gym gear, and wellness supplements driven by creator-led fitness challenges.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200',
    cover_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200',
    website: 'https://aurafitness.example.com',
    business_status: 'registered',
    service_type: 'online',
    total_orders: 115,
    location: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    followers: {
      instagram: 380000,
      facebook: 120000,
      twitter: 65000,
      youtube: 280000
    },
    metrics: {
      total_campaigns: 115,
      active_collaborations: 24,
      avg_likes: 3100,
      avg_views: 75000,
      avg_reach: 640000,
      engagement_rate: 8.4,
      avg_comments: 420,
      avg_shares: 260,
      budget_range: '$2,000 - $10,000',
      impact_score: 96
    },
    services: [
      {
        id: 'srv-31',
        title: 'Athletic Form & Studio Session',
        media_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram', 'youtube'],
        metrics: {
          likes: 420,
          comments: 80,
          shares: 45,
          views: 1350
        }
      },
      {
        id: 'srv-32',
        title: '30-Day Strength Challenge Reel',
        media_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800',
        media_type: 'video',
        platforms: ['youtube'],
        metrics: {
          likes: 590,
          comments: 110,
          shares: 70,
          views: 2100
        }
      }
    ],
    gallery: []
  },
  {
    id: 'biz-4',
    name: 'Nova Glow Beauty',
    handle: 'novaglow_official',
    company_name: 'Nova Cosmetics International',
    category: 'Beauty & Cosmetics',
    description: 'Clean skincare and bold cosmetic formulas partnering with beauty influencers for swatch testing, unboxings, and tutorials.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    cover_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200',
    website: 'https://novaglow.example.com',
    business_status: 'not_registered',
    service_type: 'online',
    total_orders: 64,
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    followers: {
      instagram: 250000,
      facebook: 100000,
      twitter: 75000,
      youtube: 50000
    },
    metrics: {
      total_campaigns: 64,
      active_collaborations: 9,
      avg_likes: 1650,
      avg_views: 38000,
      avg_reach: 290000,
      engagement_rate: 6.1,
      avg_comments: 195,
      avg_shares: 88,
      budget_range: '$1,500 - $8,000',
      impact_score: 89
    },
    services: [
      {
        id: 'srv-41',
        title: 'Dewy Finish Serum Tutorial',
        media_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
        media_type: 'video',
        platforms: ['instagram', 'youtube'],
        metrics: {
          likes: 275,
          comments: 48,
          shares: 22,
          views: 890
        }
      }
    ],
    gallery: []
  },
  {
    id: 'biz-5',
    name: 'HyperGear Audio',
    handle: 'tech_hypergear',
    company_name: 'HyperGear Tech Labs',
    category: 'Technology & Gadgets',
    description: 'Next-gen wireless headphones, creator microphones, and desk setup tech for tech reviewers and streaming stars.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    cover_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200',
    website: 'https://hypergear.example.com',
    business_status: 'registered',
    service_type: 'both',
    total_orders: 95,
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India'
    },
    followers: {
      instagram: 180000,
      facebook: 90000,
      twitter: 320000,
      youtube: 500000
    },
    metrics: {
      total_campaigns: 95,
      active_collaborations: 16,
      avg_likes: 2900,
      avg_views: 92000,
      avg_reach: 780000,
      engagement_rate: 7.9,
      avg_comments: 380,
      avg_shares: 290,
      budget_range: '$3,000 - $20,000',
      impact_score: 95
    },
    services: [
      {
        id: 'srv-51',
        title: 'Studio Mic Sound Test Unboxing',
        media_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
        media_type: 'image',
        platforms: ['facebook', 'youtube'],
        metrics: {
          likes: 490,
          comments: 85,
          shares: 40,
          views: 1420
        }
      }
    ],
    gallery: []
  },
  {
    id: 'biz-6',
    name: 'Wanderlust Escapes',
    handle: 'wander_resorts',
    company_name: 'Wanderlust Hospitality Group',
    category: 'Travel & Hospitality',
    description: 'Boutique eco-resorts and adventure glamping sites collaborating with travel creators for destination showcases.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    website: 'https://wanderlustescapes.example.com',
    business_status: 'not_registered',
    service_type: 'offline',
    total_orders: 73,
    location: {
      city: 'Goa',
      state: 'Goa',
      country: 'India'
    },
    followers: {
      instagram: 410000,
      facebook: 185000,
      twitter: 60000,
      youtube: 220000
    },
    metrics: {
      total_campaigns: 73,
      active_collaborations: 11,
      avg_likes: 2300,
      avg_views: 54000,
      avg_reach: 460000,
      engagement_rate: 7.5,
      avg_comments: 310,
      avg_shares: 195,
      budget_range: '$2,000 - $12,000',
      impact_score: 92
    },
    services: [
      {
        id: 'srv-61',
        title: 'Hidden Cliff Villa Tour',
        media_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800',
        media_type: 'image',
        platforms: ['instagram', 'facebook'],
        metrics: {
          likes: 380,
          comments: 62,
          shares: 31,
          views: 1100
        }
      }
    ],
    gallery: []
  }
];
