
import { Order } from '@/types/order';

const STORAGE_KEY = 'user_orders_data_store';

export const initialOrders: Order[] = [
  // 1. Pending Order: Post Image/Video on Instagram (matching Screenshot 1 & 2)
  {
    id: '1',
    orderNumber: '4292424244',
    date: '2026-10-02T10:15:00.000Z',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2026-10-15',
    scheduledTime: '14:30:00',
    category: 'Digital Marketing',
    productService: 'Post Image/Video (30 sec)',
    orderType: 'Platform Based',
    contentTypeName: 'Post Image/Video',
    platform: 'instagram',
    businessVerified: true,
    username: 'Username#1',
    amount: 1061,
    createdAt: '2026-10-02T10:15:00.000Z',
    updatedAt: '2026-10-02T10:15:00.000Z',
    affiliateLink: 'https://brandstore.com/ref/gary2026',
    notes: 'Please highlight the 20% discount coupon in your story caption and tag our official page @brandname.',
    influencer: {
      name: 'Gary Vaynerchuk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      category: 'Digital Marketing',
      location: 'New York, USA',
      verified: true,
      followers: [
        { platform: 'Instagram', value: '2.3M' },
        { platform: 'Facebook', value: '834K' },
        { platform: 'YouTube', value: '569K' },
        { platform: 'Twitter', value: '3.4M' },
      ],
    },
    pricing: {
      basePrice: 800,
      platformFee: 99,
      couponCode: 'WELCOME10',
      couponDiscount: 80,
      gst: 162,
      total: 1061,
    },
    content: {
      type: 'provided_content',
      description:
        'Create engaging content showcasing our new digital agency solution. Focus on high-energy lifestyle shots with clean aesthetic lighting. Include clear call-to-action for our seasonal launch campaign. Target audience: startup founders and marketing managers aged 25-45. Brand tone: innovative, authoritative, and direct. ✨ #digitalmarketing #business #growth #trending #scale',
      files: [
        {
          id: 'f1',
          name: 'brand-hero-creative.png',
          type: 'image/png',
          size: '3.4 MB',
          url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop',
        },
        {
          id: 'f2',
          name: 'campaign-brief-q4.pdf',
          type: 'application/pdf',
          size: '1.2 MB',
          url: '#',
        },
      ],
    },
    socialMediaLinks: {
      instagram: '',
      facebook: '',
      youtube: '',
      twitter: '',
    },
    timeline: [
      { step: 'Order Placed', timestamp: 'Oct 02, 2026, 10:15 AM', status: 'completed', description: 'Order request submitted by brand' },
      { step: 'Payment in Escrow', timestamp: 'Oct 02, 2026, 10:16 AM', status: 'completed', description: 'Funds held securely in platform escrow' },
      { step: 'Influencer Review', timestamp: 'Pending', status: 'current', description: 'Awaiting influencer confirmation and acceptance' },
      { step: 'Content Production', timestamp: 'Upcoming', status: 'upcoming', description: 'Influencer creates draft content for review' },
      { step: 'Published & Completed', timestamp: 'Upcoming', status: 'upcoming', description: 'Live post verified and escrow funds released' },
    ],
  },

  // 2. Pending Order: Reels/Shorts on YouTube
  {
    id: '2',
    orderNumber: '4292424245',
    date: '2026-10-01T11:30:00.000Z',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2026-10-18',
    scheduledTime: '15:45:00',
    category: 'Technology',
    productService: 'Reels/Shorts (60 sec)',
    orderType: 'Platform Based',
    contentTypeName: 'Reels/Shorts',
    platform: 'youtube',
    businessVerified: false,
    username: 'Username#2',
    amount: 1500,
    createdAt: '2026-10-01T11:30:00.000Z',
    updatedAt: '2026-10-01T11:30:00.000Z',
    affiliateLink: 'https://gadgettech.io/unboxing?ref=akash',
    notes: 'Please feature unboxing and top 3 battery life highlights within the first 15 seconds.',
    influencer: {
      name: 'Akash Singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      category: 'Technology',
      location: 'Bangalore, India',
      verified: true,
      followers: [
        { platform: 'Instagram', value: '450K' },
        { platform: 'Facebook', value: '210K' },
        { platform: 'YouTube', value: '350K' },
        { platform: 'Twitter', value: '95K' },
      ],
    },
    pricing: {
      basePrice: 1200,
      platformFee: 99,
      couponDiscount: 0,
      gst: 233,
      total: 1532,
    },
    content: {
      type: 'provided_content',
      description:
        'Hands-on review of the new ultra-portable wireless mechanical keyboard. Show pairing with laptop and tablet, sound test of brown switches, and custom RGB lighting modes.',
      files: [
        {
          id: 'f3',
          name: 'specs-sheet.pdf',
          type: 'application/pdf',
          size: '850 KB',
          url: '#',
        },
      ],
    },
    socialMediaLinks: {
      youtube: '',
    },
    timeline: [
      { step: 'Order Placed', timestamp: 'Oct 01, 2026, 11:30 AM', status: 'completed', description: 'Order request submitted' },
      { step: 'Influencer Review', timestamp: 'Oct 01, 2026, 12:00 PM', status: 'current', description: 'Influencer reviewing guidelines' },
      { step: 'Draft Submission', timestamp: 'Upcoming', status: 'upcoming', description: 'Video preview draft' },
      { step: 'Live Publish', timestamp: 'Upcoming', status: 'upcoming', description: 'YouTube Shorts release' },
    ],
  },

  // 3. Completed Order: Polls on Twitter (matching Screenshot 3)
  {
    id: '3',
    orderNumber: '4292424246',
    date: '2026-09-28T09:20:00.000Z',
    url: 'https://twitter.com/garyvee/status/1789452093849',
    status: 'completed',
    scheduledDate: '2026-09-29',
    scheduledTime: '12:00:00',
    category: 'Fashion & Lifestyle',
    productService: 'Twitter Community Polls',
    orderType: 'Platform Based',
    contentTypeName: 'Polls',
    platform: 'twitter',
    businessVerified: true,
    username: 'Username#3',
    amount: 950,
    createdAt: '2026-09-28T09:20:00.000Z',
    updatedAt: '2026-09-29T18:00:00.000Z',
    affiliateLink: 'https://trendstyle.shop/polls-fw26',
    notes: 'Please run the poll for 48 hours to maximize audience engagement before our weekend launch.',
    influencer: {
      name: 'Gary Vaynerchuk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      category: 'Digital Marketing',
      location: 'New York, USA',
      verified: true,
      followers: [
        { platform: 'Twitter', value: '3.4M' },
        { platform: 'Instagram', value: '2.3M' },
      ],
    },
    pricing: {
      basePrice: 750,
      platformFee: 99,
      couponDiscount: 50,
      gst: 143,
      total: 942,
    },
    content: {
      type: 'polls',
      description: 'Run interactive audience polls to gauge preference for autumn workwear colors.',
      polls: [
        {
          id: 'p1',
          question: 'What is your preferred color palette for Autumn office workwear?',
          options: ['Earth Tones & Olive', 'Charcoal & Classic Navy', 'Warm Burgundy & Camel', 'Minimalist Monochrome'],
        },
        {
          id: 'p2',
          question: 'Which material do you prioritize for winter daily wear?',
          options: ['100% Merino Wool', 'Breathable Organic Cotton', 'Recycled Fleece Blend', 'Cashmere Luxe'],
        },
      ],
    },
    socialMediaLinks: {
      twitter: 'https://twitter.com/garyvee/status/1789452093849',
    },
    timeline: [
      { step: 'Order Placed', timestamp: 'Sep 28, 2026, 09:20 AM', status: 'completed', description: 'Campaign brief created' },
      { step: 'Influencer Accepted', timestamp: 'Sep 28, 2026, 11:45 AM', status: 'completed', description: 'Gary Vaynerchuk approved the poll copy' },
      { step: 'Polls Published Live', timestamp: 'Sep 29, 2026, 12:00 PM', status: 'completed', description: 'Live on Twitter with 45K+ votes recorded' },
      { step: 'Order Completed', timestamp: 'Sep 29, 2026, 06:00 PM', status: 'completed', description: 'Deliverable confirmed and closed' },
    ],
  },

  // 4. Completed Order: Visit & Promote on Instagram (matching Screenshot 4)
  {
    id: '4',
    orderNumber: '4292424247',
    date: '2026-09-22T14:00:00.000Z',
    url: 'https://instagram.com/p/DAX9218sk92',
    status: 'completed',
    scheduledDate: '2026-09-25',
    scheduledTime: '11:00:00',
    category: 'Hospitality & Dining',
    productService: 'Visit & Promote Campaign',
    orderType: 'Platform Based',
    contentTypeName: 'Visit & Promote',
    platform: 'instagram',
    businessVerified: true,
    username: 'Username#4',
    amount: 3200,
    createdAt: '2026-09-22T14:00:00.000Z',
    updatedAt: '2026-09-26T16:00:00.000Z',
    affiliateLink: 'https://rooftopbistro.com/reserve?promo=VIP20',
    notes: 'Please ask for the head chef Marco upon arrival. A private tasting table is reserved on the terrace.',
    influencer: {
      name: 'Anjali Sharma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      category: 'Food & Dining',
      location: 'Mumbai, India',
      verified: true,
      followers: [
        { platform: 'Instagram', value: '320K' },
        { platform: 'Facebook', value: '150K' },
        { platform: 'YouTube', value: '200K' },
      ],
    },
    pricing: {
      basePrice: 2800,
      platformFee: 99,
      couponCode: 'NEWYEAR25',
      couponDiscount: 200,
      gst: 485,
      total: 3184,
    },
    content: {
      type: 'visit_promote',
      description: 'Exclusive weekend brunch tasting and live restaurant atmosphere walkthrough.',
      visitDetails: {
        preferredDates: ['2026-09-25', '2026-09-26'],
        timeSlot: 'Morning (11:00 AM - 02:00 PM)',
        venueName: 'The Skyview Terrace & Bistro',
        fullAddress: '7th Floor, Horizon Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
        landmarkInfo: 'Opposite Diamond Market Gate 2, Valet parking available',
        travelReimbursement: true,
        travelAmount: '₹1,500',
        foodProvided: true,
        foodDetails: 'Complimentary 5-course chef tasting menu for influencer and plus one',
        stayProvided: false,
        giftsVouchers: '₹5,000 gourmet dining gift voucher',
        otherPerks: 'Dedicated media lighting kit on-site, priority terrace seating',
        contentDescription:
          '1 Instagram Reel (60s) capturing the sunset terrace ambiance, signature mocktails, and wood-fired oven pizzas. 3 Instagram Stories with location sticker and reservation link.',
        hashtags: '#SkyviewBistro #MumbaiFoodies #TerraceDining #WeekendVibes #BandraEats',
        handlesToTag: '@skyviewbistromumbai @chef_marco_official',
        specialGuidelines: 'Please capture slow-motion pours of our signature smoking botanical mocktails.',
      },
    },
    socialMediaLinks: {
      instagram: 'https://instagram.com/p/DAX9218sk92',
      facebook: 'https://facebook.com/watch/?v=982140284',
    },
    timeline: [
      { step: 'Visit Request Booked', timestamp: 'Sep 22, 2026, 02:00 PM', status: 'completed', description: 'Store visit scheduled and approved' },
      { step: 'Venue Visit Completed', timestamp: 'Sep 25, 2026, 01:30 PM', status: 'completed', description: 'Influencer visited venue and filmed content' },
      { step: 'Reels & Stories Published', timestamp: 'Sep 26, 2026, 04:00 PM', status: 'completed', description: 'Instagram Reel published with 85K+ views' },
      { step: 'Deliverables Approved', timestamp: 'Sep 26, 2026, 06:00 PM', status: 'completed', description: 'Campaign completed successfully' },
    ],
  },
];

// Persistent localStorage helper functions
export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialOrders;
  } catch (e) {
    console.error('Error loading stored orders:', e);
    return initialOrders;
  }
};

export const getStoredOrderById = (idOrNumber: string): Order | undefined => {
  const orders = getStoredOrders();
  return orders.find(
    (o) => o.id === idOrNumber || o.orderNumber === idOrNumber || String(o.id) === String(idOrNumber)
  );
};

export const addStoredOrder = (order: Order): Order => {
  const current = getStoredOrders();
  const updated = [order, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving order to localStorage:', e);
  }
  return order;
};

export const updateStoredOrder = (order: Order): void => {
  const current = getStoredOrders();
  const updated = current.map((o) => (o.id === order.id || o.orderNumber === order.orderNumber ? order : o));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating order in localStorage:', e);
  }
};

// Export orderData for backwards compatibility
export const orderData: Order[] = initialOrders;

