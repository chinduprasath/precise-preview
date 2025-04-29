
import { OrderData } from '@/components/reach/OrderSelector';

export const mockOrders: OrderData[] = [
  { 
    id: '1', 
    name: 'Instagram Campaign - Summer Collection', 
    orderNumber: 'ORD-2025-001',
    date: '2025-04-01T10:15:00', 
    influencer: 'Christopher Campbell', 
    status: 'completed', 
    value: 125000,
    description: 'Summer fashion photoshoot with product placement and Instagram stories'
  },
  { 
    id: '2', 
    name: 'TikTok Product Launch - New Tech Gadget', 
    orderNumber: 'ORD-2025-002',
    date: '2025-04-02T11:30:00', 
    influencer: 'Kelly Sikkema', 
    status: 'processing', 
    value: 158000,
    description: 'Viral unboxing video and review of the new XYZ tech product'
  },
  { 
    id: '3', 
    name: 'YouTube Review Series - Beauty Products', 
    orderNumber: 'ORD-2025-003',
    date: '2025-04-05T14:20:00', 
    influencer: 'Houcine Ncib', 
    status: 'shipped', 
    value: 105000,
    description: 'In-depth review and tutorial for the Spring skincare line'
  },
  { 
    id: '4', 
    name: 'Instagram Story Series - Fashion Week', 
    orderNumber: 'ORD-2025-004',
    date: '2025-04-08T09:45:00', 
    influencer: 'Jake Nackos', 
    status: 'delivered', 
    value: 87000,
    description: 'Behind-the-scenes coverage of Fashion Week events and afterparties'
  },
  { 
    id: '5', 
    name: 'Multi-Platform Wellness Campaign', 
    orderNumber: 'ORD-2025-005',
    date: '2025-04-12T16:30:00', 
    influencer: 'Sarah Johnson', 
    status: 'completed', 
    value: 210000,
    description: 'Coordinated campaign across Instagram, YouTube, and Facebook promoting wellness products'
  },
];

export const platformEngagementData = {
  '1': [
    { day: 'Mon', instagram: 4200, facebook: 2800, twitter: 1500, youtube: 800 },
    { day: 'Tue', instagram: 3800, facebook: 3000, twitter: 1200, youtube: 750 },
    { day: 'Wed', instagram: 5100, facebook: 3500, twitter: 2000, youtube: 1100 },
    { day: 'Thu', instagram: 5800, facebook: 3800, twitter: 2200, youtube: 1300 },
    { day: 'Fri', instagram: 4900, facebook: 3200, twitter: 1800, youtube: 950 },
    { day: 'Sat', instagram: 3400, facebook: 2500, twitter: 1100, youtube: 600 },
    { day: 'Sun', instagram: 3200, facebook: 2400, twitter: 900, youtube: 500 }
  ],
  '2': [
    { day: 'Mon', instagram: 5200, facebook: 3100, twitter: 2500, youtube: 1800 },
    { day: 'Tue', instagram: 4800, facebook: 3300, twitter: 2200, youtube: 1750 },
    { day: 'Wed', instagram: 6100, facebook: 3800, twitter: 3000, youtube: 2100 },
    { day: 'Thu', instagram: 6800, facebook: 4100, twitter: 3200, youtube: 2300 },
    { day: 'Fri', instagram: 5900, facebook: 3500, twitter: 2800, youtube: 1950 },
    { day: 'Sat', instagram: 4400, facebook: 2800, twitter: 2100, youtube: 1600 },
    { day: 'Sun', instagram: 4200, facebook: 2700, twitter: 1900, youtube: 1500 }
  ],
  '3': [
    { day: 'Mon', instagram: 3200, facebook: 1800, twitter: 1200, youtube: 2800 },
    { day: 'Tue', instagram: 2800, facebook: 2000, twitter: 1100, youtube: 2750 },
    { day: 'Wed', instagram: 3100, facebook: 2500, twitter: 1400, youtube: 3100 },
    { day: 'Thu', instagram: 3800, facebook: 2800, twitter: 1500, youtube: 3300 },
    { day: 'Fri', instagram: 2900, facebook: 2200, twitter: 1300, youtube: 2950 },
    { day: 'Sat', instagram: 2400, facebook: 1800, twitter: 900, youtube: 2600 },
    { day: 'Sun', instagram: 2200, facebook: 1600, twitter: 800, youtube: 2500 }
  ],
  '4': [
    { day: 'Mon', instagram: 6200, facebook: 2100, twitter: 1700, youtube: 900 },
    { day: 'Tue', instagram: 5800, facebook: 2300, twitter: 1600, youtube: 850 },
    { day: 'Wed', instagram: 7100, facebook: 2800, twitter: 2300, youtube: 1200 },
    { day: 'Thu', instagram: 7800, facebook: 3100, twitter: 2500, youtube: 1400 },
    { day: 'Fri', instagram: 6900, facebook: 2500, twitter: 2100, youtube: 1050 },
    { day: 'Sat', instagram: 5400, facebook: 1800, twitter: 1400, youtube: 700 },
    { day: 'Sun', instagram: 5200, facebook: 1700, twitter: 1200, youtube: 600 }
  ],
  '5': [
    { day: 'Mon', instagram: 5200, facebook: 3800, twitter: 2500, youtube: 2800 },
    { day: 'Tue', instagram: 4800, facebook: 4000, twitter: 2300, youtube: 2750 },
    { day: 'Wed', instagram: 6100, facebook: 4500, twitter: 3100, youtube: 3100 },
    { day: 'Thu', instagram: 6800, facebook: 4800, twitter: 3400, youtube: 3300 },
    { day: 'Fri', instagram: 5900, facebook: 4200, twitter: 2900, youtube: 2950 },
    { day: 'Sat', instagram: 4400, facebook: 3500, twitter: 2200, youtube: 2600 },
    { day: 'Sun', instagram: 4200, facebook: 3400, twitter: 2000, youtube: 2500 }
  ]
};

export const platformReachData = {
  '1': [
    { day: 'Mon', instagram_reach: 12000, facebook_reach: 9500, twitter_reach: 5000, youtube_reach: 3000 },
    { day: 'Tue', instagram_reach: 13500, facebook_reach: 10200, twitter_reach: 5500, youtube_reach: 3200 },
    { day: 'Wed', instagram_reach: 18200, facebook_reach: 15000, twitter_reach: 7800, youtube_reach: 4500 },
    { day: 'Thu', instagram_reach: 20500, facebook_reach: 16800, twitter_reach: 8500, youtube_reach: 5200 },
    { day: 'Fri', instagram_reach: 17800, facebook_reach: 14200, twitter_reach: 7200, youtube_reach: 4800 },
    { day: 'Sat', instagram_reach: 14200, facebook_reach: 11500, twitter_reach: 6000, youtube_reach: 3500 },
    { day: 'Sun', instagram_reach: 13800, facebook_reach: 10800, twitter_reach: 5800, youtube_reach: 3300 }
  ],
  '2': [
    { day: 'Mon', instagram_reach: 22000, facebook_reach: 11500, twitter_reach: 7000, youtube_reach: 5000 },
    { day: 'Tue', instagram_reach: 23500, facebook_reach: 12200, twitter_reach: 7500, youtube_reach: 5200 },
    { day: 'Wed', instagram_reach: 28200, facebook_reach: 17000, twitter_reach: 9800, youtube_reach: 6500 },
    { day: 'Thu', instagram_reach: 30500, facebook_reach: 18800, twitter_reach: 10500, youtube_reach: 7200 },
    { day: 'Fri', instagram_reach: 27800, facebook_reach: 16200, twitter_reach: 9200, youtube_reach: 6800 },
    { day: 'Sat', instagram_reach: 24200, facebook_reach: 13500, twitter_reach: 8000, youtube_reach: 5500 },
    { day: 'Sun', instagram_reach: 23800, facebook_reach: 12800, twitter_reach: 7800, youtube_reach: 5300 }
  ],
  '3': [
    { day: 'Mon', instagram_reach: 8000, facebook_reach: 6500, twitter_reach: 4000, youtube_reach: 15000 },
    { day: 'Tue', instagram_reach: 8500, facebook_reach: 7200, twitter_reach: 4500, youtube_reach: 16200 },
    { day: 'Wed', instagram_reach: 9200, facebook_reach: 8000, twitter_reach: 5800, youtube_reach: 19000 },
    { day: 'Thu', instagram_reach: 10500, facebook_reach: 8800, twitter_reach: 6500, youtube_reach: 21200 },
    { day: 'Fri', instagram_reach: 9800, facebook_reach: 8200, twitter_reach: 6200, youtube_reach: 18800 },
    { day: 'Sat', instagram_reach: 8200, facebook_reach: 7500, twitter_reach: 4800, youtube_reach: 15500 },
    { day: 'Sun', instagram_reach: 7800, facebook_reach: 6800, twitter_reach: 4500, youtube_reach: 15300 }
  ],
  '4': [
    { day: 'Mon', instagram_reach: 28000, facebook_reach: 7500, twitter_reach: 6000, youtube_reach: 4000 },
    { day: 'Tue', instagram_reach: 29500, facebook_reach: 8200, twitter_reach: 6500, youtube_reach: 4200 },
    { day: 'Wed', instagram_reach: 35200, facebook_reach: 9000, twitter_reach: 8800, youtube_reach: 5500 },
    { day: 'Thu', instagram_reach: 38500, facebook_reach: 9800, twitter_reach: 9500, youtube_reach: 6200 },
    { day: 'Fri', instagram_reach: 32800, facebook_reach: 9200, twitter_reach: 8200, youtube_reach: 5800 },
    { day: 'Sat', instagram_reach: 28200, facebook_reach: 8500, twitter_reach: 6800, youtube_reach: 4500 },
    { day: 'Sun', instagram_reach: 27800, facebook_reach: 7800, twitter_reach: 6500, youtube_reach: 4300 }
  ],
  '5': [
    { day: 'Mon', instagram_reach: 18000, facebook_reach: 16500, twitter_reach: 9000, youtube_reach: 15000 },
    { day: 'Tue', instagram_reach: 19500, facebook_reach: 17200, twitter_reach: 9500, youtube_reach: 16200 },
    { day: 'Wed', instagram_reach: 25200, facebook_reach: 20000, twitter_reach: 11800, youtube_reach: 19000 },
    { day: 'Thu', instagram_reach: 28500, facebook_reach: 21800, twitter_reach: 12500, youtube_reach: 21200 },
    { day: 'Fri', instagram_reach: 23800, facebook_reach: 19200, twitter_reach: 11200, youtube_reach: 18800 },
    { day: 'Sat', instagram_reach: 19200, facebook_reach: 16500, twitter_reach: 9800, youtube_reach: 15500 },
    { day: 'Sun', instagram_reach: 18800, facebook_reach: 15800, twitter_reach: 9500, youtube_reach: 15300 }
  ]
};

export const conversionData = {
  '1': [
    { day: 'Mon', clicks: 520, conversions: 78 },
    { day: 'Tue', clicks: 480, conversions: 65 },
    { day: 'Wed', clicks: 750, conversions: 112 },
    { day: 'Thu', clicks: 820, conversions: 123 },
    { day: 'Fri', clicks: 680, conversions: 102 },
    { day: 'Sat', clicks: 450, conversions: 68 },
    { day: 'Sun', clicks: 420, conversions: 63 }
  ],
  '2': [
    { day: 'Mon', clicks: 720, conversions: 108 },
    { day: 'Tue', clicks: 680, conversions: 95 },
    { day: 'Wed', clicks: 950, conversions: 142 },
    { day: 'Thu', clicks: 1020, conversions: 153 },
    { day: 'Fri', clicks: 880, conversions: 132 },
    { day: 'Sat', clicks: 650, conversions: 98 },
    { day: 'Sun', clicks: 620, conversions: 93 }
  ],
  '3': [
    { day: 'Mon', clicks: 420, conversions: 126 },
    { day: 'Tue', clicks: 390, conversions: 117 },
    { day: 'Wed', clicks: 580, conversions: 174 },
    { day: 'Thu', clicks: 650, conversions: 195 },
    { day: 'Fri', clicks: 540, conversions: 162 },
    { day: 'Sat', clicks: 380, conversions: 114 },
    { day: 'Sun', clicks: 350, conversions: 105 }
  ],
  '4': [
    { day: 'Mon', clicks: 620, conversions: 62 },
    { day: 'Tue', clicks: 580, conversions: 58 },
    { day: 'Wed', clicks: 850, conversions: 85 },
    { day: 'Thu', clicks: 920, conversions: 92 },
    { day: 'Fri', clicks: 780, conversions: 78 },
    { day: 'Sat', clicks: 550, conversions: 55 },
    { day: 'Sun', clicks: 520, conversions: 52 }
  ],
  '5': [
    { day: 'Mon', clicks: 820, conversions: 164 },
    { day: 'Tue', clicks: 780, conversions: 156 },
    { day: 'Wed', clicks: 1050, conversions: 210 },
    { day: 'Thu', clicks: 1120, conversions: 224 },
    { day: 'Fri', clicks: 980, conversions: 196 },
    { day: 'Sat', clicks: 750, conversions: 150 },
    { day: 'Sun', clicks: 720, conversions: 144 }
  ]
};

export const demographicData = {
  '1': [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 15 },
    { name: '45-54', value: 7 },
    { name: '55+', value: 3 }
  ],
  '2': [
    { name: '18-24', value: 45 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 12 },
    { name: '45-54', value: 5 },
    { name: '55+', value: 3 }
  ],
  '3': [
    { name: '18-24', value: 20 },
    { name: '25-34', value: 30 },
    { name: '35-44', value: 25 },
    { name: '45-54', value: 15 },
    { name: '55+', value: 10 }
  ],
  '4': [
    { name: '18-24', value: 50 },
    { name: '25-34', value: 32 },
    { name: '35-44', value: 10 },
    { name: '45-54', value: 5 },
    { name: '55+', value: 3 }
  ],
  '5': [
    { name: '18-24', value: 28 },
    { name: '25-34', value: 38 },
    { name: '35-44', value: 20 },
    { name: '45-54', value: 10 },
    { name: '55+', value: 4 }
  ]
};

export const performanceData = {
  '1': [
    { label: 'ROI', value: '245%', percentage: 85 },
    { label: 'CTR', value: '5.2%', percentage: 70 },
    { label: 'Completion Rate', value: '92%', percentage: 92 },
    { label: 'Cost per Acquisition', value: '₹1,247', percentage: 63 },
    { label: 'Brand Sentiment', value: 'Positive (78%)', percentage: 78 }
  ],
  '2': [
    { label: 'ROI', value: '320%', percentage: 90 },
    { label: 'CTR', value: '6.8%', percentage: 80 },
    { label: 'Completion Rate', value: '88%', percentage: 88 },
    { label: 'Cost per Acquisition', value: '₹980', percentage: 75 },
    { label: 'Brand Sentiment', value: 'Positive (82%)', percentage: 82 }
  ],
  '3': [
    { label: 'ROI', value: '210%', percentage: 75 },
    { label: 'CTR', value: '7.5%', percentage: 85 },
    { label: 'Completion Rate', value: '95%', percentage: 95 },
    { label: 'Cost per Acquisition', value: '₹850', percentage: 80 },
    { label: 'Brand Sentiment', value: 'Positive (90%)', percentage: 90 }
  ],
  '4': [
    { label: 'ROI', value: '185%', percentage: 65 },
    { label: 'CTR', value: '4.8%', percentage: 65 },
    { label: 'Completion Rate', value: '86%', percentage: 86 },
    { label: 'Cost per Acquisition', value: '₹1,450', percentage: 55 },
    { label: 'Brand Sentiment', value: 'Positive (70%)', percentage: 70 }
  ],
  '5': [
    { label: 'ROI', value: '275%', percentage: 88 },
    { label: 'CTR', value: '6.5%', percentage: 78 },
    { label: 'Completion Rate', value: '94%', percentage: 94 },
    { label: 'Cost per Acquisition', value: '₹920', percentage: 78 },
    { label: 'Brand Sentiment', value: 'Positive (85%)', percentage: 85 }
  ]
};

export const getOrderMetrics = (orderId: string) => {
  const metrics = {
    impressions: {
      value: 0,
      change: 0
    },
    engagementRate: {
      value: 0,
      change: 0
    },
    conversionRate: {
      value: 0,
      change: 0
    }
  };

  switch (orderId) {
    case '1':
      metrics.impressions.value = 125400;
      metrics.impressions.change = 12.5;
      metrics.engagementRate.value = 8.2;
      metrics.engagementRate.change = 3.1;
      metrics.conversionRate.value = 3.6;
      metrics.conversionRate.change = 1.2;
      break;
    case '2':
      metrics.impressions.value = 158200;
      metrics.impressions.change = 15.8;
      metrics.engagementRate.value = 10.5;
      metrics.engagementRate.change = 4.2;
      metrics.conversionRate.value = 4.2;
      metrics.conversionRate.change = 1.5;
      break;
    case '3':
      metrics.impressions.value = 105300;
      metrics.impressions.change = -2.5;
      metrics.engagementRate.value = 12.8;
      metrics.engagementRate.change = 5.6;
      metrics.conversionRate.value = 6.5;
      metrics.conversionRate.change = 2.3;
      break;
    case '4':
      metrics.impressions.value = 87500;
      metrics.impressions.change = 8.7;
      metrics.engagementRate.value = 9.4;
      metrics.engagementRate.change = -1.2;
      metrics.conversionRate.value = 2.8;
      metrics.conversionRate.change = -0.5;
      break;
    case '5':
      metrics.impressions.value = 210800;
      metrics.impressions.change = 18.3;
      metrics.engagementRate.value = 11.2;
      metrics.engagementRate.change = 4.8;
      metrics.conversionRate.value = 5.1;
      metrics.conversionRate.change = 2.1;
      break;
  }

  return metrics;
};
