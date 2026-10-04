import { InfluencerRequest, RequestStatus } from '@/types/request';

const STORAGE_KEY = 'influencer_requests_store_v6';

export const initialRequests: InfluencerRequest[] = [
  {
    id: '1',
    businessId: 'b1',
    businessName: 'Nova Fashion Studio',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'Post Image/Video',
    serviceType: 'post',
    platform: 'instagram',
    description: 'Fashion Service campaign for our upcoming Autumn 2026 Collection',
    price: 800,
    status: 'pending',
    dateRequested: '2023-03-01T06:25:23.000Z',
    createdAt: '2023-03-01T06:25:23.000Z',
    updatedAt: '2023-03-01T06:25:23.000Z',
    content: {
      type: 'upload_files',
      files: ['fashion-brief.pdf', 'brand-guidelines.jpg']
    },
    businessInfo: {
      businessName: 'Nova Fashion Studio',
      category: 'Fashion & Apparel',
      serviceType: 'Online & Offline',
      website: 'https://novafashion.example.com',
      address: 'Tower B, Phoenix Market City, Kurla West, Mumbai 400070',
      accountManagement: 'Managed Account',
      socialLinks: {
        instagram: 'https://instagram.com/novafashion',
        facebook: 'https://facebook.com/novafashion',
        youtube: 'https://youtube.com/@novafashion',
        twitter: 'https://x.com/novafashion'
      }
    }
  },
  {
    id: '2',
    businessId: 'b2',
    businessName: 'GlowSkin Organics',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'Reels/Shorts',
    serviceType: 'reel',
    platform: 'instagram',
    description: 'ECommerce Products showcase - Create engaging reels highlighting pure botanical ingredients and skincare routine.',
    price: 950,
    status: 'pending',
    dateRequested: '2023-03-02T10:15:00.000Z',
    createdAt: '2023-03-02T10:15:00.000Z',
    updatedAt: '2023-03-02T10:15:00.000Z',
    content: {
      type: 'provided_content',
      description: 'Create engaging reels showcasing our new product line with lifestyle shots and product features.'
    },
    businessInfo: {
      businessName: 'GlowSkin Organics',
      category: 'Beauty & Cosmetics',
      serviceType: 'Online & Offline',
      website: 'https://glowskin.example.com',
      address: 'Plot 12, Green Park Avenue, South Extension, New Delhi 110049',
      accountManagement: 'Option 1',
      socialLinks: {
        instagram: 'https://instagram.com/glowskin',
        facebook: 'https://facebook.com/glowskin',
        youtube: 'https://youtube.com/@glowskin',
        twitter: 'https://x.com/glowskin'
      }
    }
  },
  {
    id: '3',
    businessId: 'b3',
    businessName: 'TechGizmo Electronics',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'Polls',
    serviceType: 'story',
    platform: 'twitter',
    description: 'Interactive Audience Polls for Winter Collection Drop & Style Preferences',
    price: 600,
    status: 'pending',
    dateRequested: '2023-03-03T12:30:00.000Z',
    createdAt: '2023-03-03T12:30:00.000Z',
    updatedAt: '2023-03-03T12:30:00.000Z',
    content: {
      type: 'polls',
      polls: [
        {
          id: '1',
          question: 'Which style should lead our upcoming winter collection drop?',
          options: [
            'Oversized Trench Coat',
            'Cropped Puffer Jacket',
            'Wool Blend Knitwear',
            'Layered Streetwear Look'
          ]
        },
        {
          id: '2',
          question: 'What is your target budget for premium winter outerwear?',
          options: [
            'Under ₹5,000',
            '₹5,000 - ₹10,000',
            '₹10,000 - ₹20,000',
            'Designer > ₹20,000'
          ]
        }
      ]
    },
    businessInfo: {
      businessName: 'TechGizmo Electronics',
      category: 'Consumer Electronics & Gadgets',
      serviceType: 'Online & Offline',
      website: 'https://techgizmo.example.com',
      address: 'Tech District, Cyber City, Phase 2, Gurugram 122002',
      accountManagement: 'Managed Account',
      socialLinks: {
        instagram: 'https://instagram.com/techgizmo',
        facebook: 'https://facebook.com/techgizmo',
        youtube: 'https://youtube.com/@techgizmo',
        twitter: 'https://x.com/techgizmo'
      }
    }
  },
  {
    id: '4',
    businessId: 'b4',
    businessName: 'Urban Bistro & Lounge',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'Visit & Promote',
    serviceType: 'reel',
    platform: ['instagram', 'youtube'],
    description: 'Visit & Promote: On-site store experience, dining vlog, and sharing exclusive audience booking links',
    price: 1500,
    status: 'pending',
    dateRequested: '2023-03-04T14:45:00.000Z',
    createdAt: '2023-03-04T14:45:00.000Z',
    updatedAt: '2023-03-04T14:45:00.000Z',
    content: {
      type: 'visit_promote',
      visitPromote: {
        venueName: 'Urban Bistro & Lounge - Indiranagar',
        fullAddress: '458 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
        landmarkInfo: 'Opposite Metro Pillar 182, 3 min walk from Indiranagar Metro Station',
        preferredDates: ['2026-10-22', '2026-10-25'],
        timeSlot: 'Evening (6:00 PM - 9:00 PM)',
        travelReimbursement: true,
        travelAmount: '₹800 Cab fare both ways covered',
        foodProvided: true,
        foodDetails: 'Complimentary 4-course Chef Tasting Menu for 2 with mocktails & dessert',
        stayProvided: false,
        stayDetails: '',
        contentDescription: 'Shoot an engaging dining experience vlog, cover live mocktail mixing and highlight the signature pasta & pizza collection.',
        hashtags: '#UrbanBistro #BangaloreFoodies #IndiranagarDining #BangaloreCafes',
        handlesToTag: '@urbanbistro @chefindiranagar',
        specialGuidelines: 'Casual chic or party wear. Capture ambient evening warm lighting. Please tag location as Urban Bistro Indiranagar.',
        offers: 'Complimentary 4-course Chef Tasting Menu for 2, Valet Parking, Dedicated Creator Lounge',
        guidelines: 'Capture ambiance reel (60s), high-res food shots for stories, cover live music zone and craft cocktail bar.',
        googleMapsLink: 'https://maps.google.com/?q=Urban+Bistro+Indiranagar+Bengaluru',
        affiliateLinks: [
          'https://urbanbistro.in/reserve?promo=ALEXVIP',
          'https://urbanbistro.in/special-tasting?ref=alex2026'
        ]
      }
    },
    businessInfo: {
      businessName: 'Urban Bistro & Lounge',
      category: 'Food & Hospitality',
      serviceType: 'Online & Offline',
      website: 'https://urbanbistro.example.com',
      address: '458 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      accountManagement: 'Dedicated Account Manager',
      socialLinks: {
        instagram: 'https://instagram.com/urbanbistro',
        facebook: 'https://facebook.com/urbanbistro',
        youtube: 'https://youtube.com/@urbanbistro',
        twitter: 'https://x.com/urbanbistro'
      }
    }
  },
  {
    id: '5',
    businessId: 'b5',
    businessName: 'Skyline Travel & Tours',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'Story (Image/Video)',
    serviceType: 'story',
    platform: 'instagram',
    description: 'Travel Content - Luxury staycation weekend package preview',
    price: 850,
    status: 'approved',
    dateRequested: '2023-03-05T09:20:00.000Z',
    createdAt: '2023-03-05T09:20:00.000Z',
    updatedAt: '2023-03-05T09:20:00.000Z',
    businessInfo: {
      businessName: 'Skyline Travel & Tours',
      category: 'Travel & Tourism',
      serviceType: 'Online & Offline',
      website: 'https://skylinetravel.example.com',
      address: '77 Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru 560025',
      accountManagement: 'Select',
      socialLinks: {
        instagram: 'https://instagram.com/skylinetravel',
        facebook: 'https://facebook.com/skylinetravel',
        youtube: 'https://youtube.com/@skylinetravel',
        twitter: 'https://x.com/skylinetravel'
      }
    }
  },
  {
    id: '6',
    businessId: 'b6',
    businessName: 'Pulse Beats Fitness',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'In-Video Promotion (<10 min)',
    serviceType: 'video',
    platform: 'youtube',
    description: 'Fitness App in-depth product review and workout routine integration (<10 min)',
    price: 1800,
    status: 'approved',
    dateRequested: '2023-03-06T16:10:00.000Z',
    createdAt: '2023-03-06T16:10:00.000Z',
    updatedAt: '2023-03-06T16:10:00.000Z',
    businessInfo: {
      businessName: 'Pulse Beats Fitness',
      category: 'Health & Fitness',
      serviceType: 'Online & Offline',
      website: 'https://pulsebeats.example.com',
      address: '14 Park Street, Kolkata, West Bengal 700016',
      accountManagement: 'Option 2',
      socialLinks: {
        instagram: 'https://instagram.com/pulsebeats',
        facebook: 'https://facebook.com/pulsebeats',
        youtube: 'https://youtube.com/@pulsebeats',
        twitter: 'https://x.com/pulsebeats'
      }
    }
  },
  {
    id: '7',
    businessId: 'b7',
    businessName: 'Spice Symphony Bistro',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'Promotions (>10 min)',
    serviceType: 'video',
    platform: 'youtube',
    description: 'Comprehensive restaurant culinary tour and head chef feature (>10 min documentary format)',
    price: 2400,
    status: 'rejected',
    dateRequested: '2023-03-07T11:05:00.000Z',
    createdAt: '2023-03-07T11:05:00.000Z',
    updatedAt: '2023-03-07T11:05:00.000Z',
    businessInfo: {
      businessName: 'Spice Symphony Bistro',
      category: 'Restaurants & Dining',
      serviceType: 'Online & Offline',
      website: 'https://spicesymphony.example.com',
      address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
      accountManagement: 'Select',
      socialLinks: {
        instagram: 'https://instagram.com/spicesymphony',
        facebook: 'https://facebook.com/spicesymphony',
        youtube: 'https://youtube.com/@spicesymphony',
        twitter: 'https://x.com/spicesymphony'
      }
    }
  },
  {
    id: '8',
    businessId: 'b8',
    businessName: 'QuickBite Express',
    influencerId: 'i1',
    influencerName: 'Alex',
    orderType: 'VIP Brand Ambassador Package',
    serviceType: 'reel',
    platform: 'instagram',
    description: 'Custom Package: 30-day multi-channel brand ambassadorship campaign with recurring delivery vlogs',
    price: 3200,
    status: 'rejected',
    dateRequested: '2023-03-08T13:40:00.000Z',
    createdAt: '2023-03-08T13:40:00.000Z',
    updatedAt: '2023-03-08T13:40:00.000Z',
    businessInfo: {
      businessName: 'QuickBite Express',
      category: 'Food Delivery & Logistics',
      serviceType: 'Online & Offline',
      website: 'https://quickbite.example.com',
      address: 'Sector 62, Electronic City, Noida, Uttar Pradesh 201309',
      accountManagement: 'Option 1',
      socialLinks: {
        instagram: 'https://instagram.com/quickbite',
        facebook: 'https://facebook.com/quickbite',
        youtube: 'https://youtube.com/@quickbite',
        twitter: 'https://x.com/quickbite'
      }
    }
  }
];

export function getStoredRequests(): InfluencerRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored requests:', e);
  }
  // Initialize with initialRequests
  saveRequests(initialRequests);
  return initialRequests;
}

export function saveRequests(requests: InfluencerRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests:', e);
  }
}

export function getRequestById(id: string): InfluencerRequest | undefined {
  const all = getStoredRequests();
  return all.find((req) => req.id === id);
}

export function updateRequest(id: string, updates: Partial<InfluencerRequest>): InfluencerRequest | undefined {
  const all = getStoredRequests();
  const index = all.findIndex((req) => req.id === id);
  if (index === -1) return undefined;

  const updated: InfluencerRequest = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  all[index] = updated;
  saveRequests(all);
  return updated;
}
