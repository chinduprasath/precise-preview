
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

  // 5. Pending Order: Polls on Twitter
  {
    id: '5',
    orderNumber: '4292424250',
    date: '2026-10-02T12:00:00.000Z',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2026-10-20',
    scheduledTime: '15:00:00',
    category: 'Fashion & Lifestyle',
    productService: 'Twitter/X Community Polls',
    orderType: 'Platform Based',
    contentTypeName: 'Polls',
    platform: 'twitter',
    businessVerified: true,
    username: 'Sarah Johnson',
    amount: 950,
    createdAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z',
    affiliateLink: 'https://brandshop.com/survey?ref=sarah_poll',
    notes: 'Please run the poll for 48 hours to engage our target demographic before our winter release.',
    influencer: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      category: 'Fashion & Lifestyle',
      location: 'Mumbai, India',
      verified: true,
      followers: [
        { platform: 'Twitter', value: '820K' },
        { platform: 'Instagram', value: '1.4M' },
        { platform: 'YouTube', value: '350K' },
        { platform: 'Facebook', value: '290K' },
      ],
    },
    pricing: {
      basePrice: 750,
      platformFee: 99,
      couponDiscount: 50,
      gst: 151,
      total: 950,
    },
    content: {
      type: 'polls',
      description: 'Community engagement poll to choose our new winter capsule collection colorways and styles.',
      polls: [
        {
          id: 'p1',
          question: 'Which style should lead our upcoming winter collection drop?',
          options: ['Oversized Trench Coat', 'Cropped Puffer Jacket', 'Wool Blend Knitwear', 'Layered Streetwear Look'],
        },
        {
          id: 'p2',
          question: 'What primary color palette do you prefer for daily winter outfits?',
          options: ['Minimalist Slate & Black', 'Warm Camel & Beige', 'Forest Green & Olive', 'Deep Burgundy & Wine'],
        },
      ],
    },
    socialMediaLinks: {
      twitter: '',
    },
    timeline: [
      { step: 'Order Placed', timestamp: 'Oct 02, 2026, 12:00 PM', status: 'completed', description: 'Order request submitted' },
      { step: 'Payment in Escrow', timestamp: 'Pending', status: 'current', description: 'Awaiting checkout confirmation' },
      { step: 'Influencer Review', timestamp: 'Upcoming', status: 'upcoming', description: 'Reviewing poll questions' },
      { step: 'Live Published', timestamp: 'Upcoming', status: 'upcoming', description: 'Poll published on Twitter' },
    ],
  },

  // 6. Pending Order: Visit & Promote on Instagram
  {
    id: '6',
    orderNumber: '4292424251',
    date: '2026-10-02T13:30:00.000Z',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2026-10-22',
    scheduledTime: '11:00:00',
    category: 'Retail & Hospitality',
    productService: 'Store Visit & Grand Opening Promotion',
    orderType: 'Platform Based',
    contentTypeName: 'Visit & Promote',
    platform: 'instagram',
    businessVerified: true,
    username: 'Rohan Mehra',
    amount: 4500,
    createdAt: '2026-10-02T13:30:00.000Z',
    updatedAt: '2026-10-02T13:30:00.000Z',
    affiliateLink: 'https://retailhub.com/grand-opening?ref=rohan_vip',
    notes: 'VIP entrance via Gate 3. Valet parking provided. Coordinator Neha will welcome you at the reception.',
    influencer: {
      name: 'Rohan Mehra',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      category: 'Lifestyle & Travel',
      location: 'Delhi, India',
      verified: true,
      followers: [
        { platform: 'Instagram', value: '890K' },
        { platform: 'YouTube', value: '420K' },
        { platform: 'Facebook', value: '180K' },
        { platform: 'Twitter', value: '110K' },
      ],
    },
    pricing: {
      basePrice: 3800,
      platformFee: 99,
      couponDiscount: 100,
      gst: 701,
      total: 4500,
    },
    content: {
      type: 'visit_promote',
      description: 'Visit our new flagship experience store in Lower Parel, explore the interactive trial booths, and shoot 1 Reel + 3 Stories.',
      visitDetails: {
        preferredDates: ['2026-10-22', '2026-10-23'],
        timeSlot: '11:00 AM - 02:30 PM',
        venueName: 'Flagship Retail Experience Center',
        fullAddress: 'Shop 12-16, Phoenix Palladium, High Street Phoenix, Lower Parel, Mumbai 400013',
        landmarkInfo: 'Grand Atrium, Level 1 next to Apple Store',
        travelReimbursement: true,
        travelAmount: '₹2,000',
        foodProvided: true,
        foodDetails: 'Complimentary lunch & refreshments at Palladium Cafe',
        stayProvided: false,
        giftsVouchers: '₹10,000 shopping gift card + exclusive brand merchandise box',
        otherPerks: 'Priority access before public store hours, professional photographer available on request',
        contentDescription: '1 Store Tour Reel (60s) showing walkthrough and top 3 must-buy products. 3 Instagram Stories with countdown and store location sticker.',
        hashtags: '#StoreLaunch #MumbaiShopping #ExperienceStore #GrandOpening #InfluencerVisit',
        handlesToTag: '@retailhub_official @phoenixpalladium',
        specialGuidelines: 'Highlight the custom personalization station where shoppers can customize their initials.',
      },
    },
    socialMediaLinks: {
      instagram: '',
      facebook: '',
    },
    timeline: [
      { step: 'Order Placed', timestamp: 'Oct 02, 2026, 01:30 PM', status: 'completed', description: 'Visit request submitted' },
      { step: 'Payment in Escrow', timestamp: 'Pending', status: 'current', description: 'Awaiting checkout' },
      { step: 'Venue Visit', timestamp: 'Upcoming', status: 'upcoming', description: 'Scheduled for Oct 22' },
      { step: 'Published & Completed', timestamp: 'Upcoming', status: 'upcoming', description: 'Content verified' },
    ],
  },

  // 7. Service Order: AI chatbots & Automation reviewed & priced by Support Team
  {
    id: '7',
    orderNumber: '8923419821',
    date: '2026-10-03T11:45:00.000Z',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2026-10-25',
    scheduledTime: '16:00:00',
    category: 'AI & Automation',
    productService: 'AI chatbots',
    orderType: 'Service',
    contentTypeName: 'Service',
    platform: 'custom',
    businessVerified: true,
    username: 'Support Desk',
    amount: 4247,
    createdAt: '2026-10-03T11:45:00.000Z',
    updatedAt: '2026-10-03T12:30:00.000Z',
    supportStatus: 'Quote Provided - Ready for Checkout',
    notes: 'Support reviewed client specifications. Pricing finalized for AI chatbots deployment, customized knowledge base integration, and WhatsApp webhook automation.',
    influencer: {
      name: 'AI & Automation Studio (Support Team)',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      category: 'AI & Automation',
      location: 'Bangalore, India',
      verified: true,
      followers: [
        { platform: 'Projects Completed', value: '450+' },
        { platform: 'Rating', value: '4.9 ★' },
        { platform: 'Avg Turnaround', value: '3 Days' },
        { platform: 'Specialists', value: '12' },
      ],
    },
    pricing: {
      basePrice: 3500,
      platformFee: 99,
      couponDiscount: 0,
      gst: 648,
      total: 4247,
    },
    serviceDetails: {
      serviceId: '21',
      serviceName: 'AI chatbots',
      category: 'AI & Automation',
      clientName: 'Vikram Malhotra',
      clientEmail: 'vikram.m@malhotratech.in',
      clientPhone: '+91 98765 43210',
      description: 'Need an intelligent conversational AI chatbot for our website and customer support portal. Integrates with existing CRM and handles 24/7 lead capture.',
      budgetRange: '$500 - $1,000',
      timeline: 'Within 1 week',
      supportStatus: 'quote_provided',
      supportStatusDisplay: 'Quote Provided - Ready for Checkout',
      assignedSpecialist: {
        name: 'Alex Johnson',
        role: 'Senior Automation Engineer & Support Lead',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'alex.j@influex.com',
      },
      supportReviewNotes: 'Requirements and workflow analyzed by Alex Johnson. Scope confirmed for AI Chatbot training on company docs, WhatsApp webhook integration, and dashboard setup. Fixed price: ₹3,500 + GST. Awaiting client checkout.',
      deliverables: [
        'Custom Fine-tuned AI Chatbot Model (RAG on brand docs)',
        'CRM & Lead Capture Webhook Integrations',
        'Multi-channel Deployment (Web Widget & WhatsApp)',
        'Admin Analytics Dashboard & 1 Month Support'
      ],
      estimatedDeliveryDate: '2026-10-25',
    },
    content: {
      type: 'service_request',
      description: 'Need an intelligent conversational AI chatbot for our website and customer support portal. Integrates with existing CRM and handles 24/7 lead capture.',
      serviceDetails: {
        serviceId: '21',
        serviceName: 'AI chatbots',
        category: 'AI & Automation',
        clientName: 'Vikram Malhotra',
        clientEmail: 'vikram.m@malhotratech.in',
        clientPhone: '+91 98765 43210',
        description: 'Need an intelligent conversational AI chatbot for our website and customer support portal. Integrates with existing CRM and handles 24/7 lead capture.',
        budgetRange: '$500 - $1,000',
        timeline: 'Within 1 week',
        supportStatus: 'quote_provided',
        supportStatusDisplay: 'Quote Provided - Ready for Checkout',
        assignedSpecialist: {
          name: 'Alex Johnson',
          role: 'Senior Automation Engineer & Support Lead',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          email: 'alex.j@influex.com',
        },
        supportReviewNotes: 'Requirements and workflow analyzed by Alex Johnson. Scope confirmed for AI Chatbot training on company docs, WhatsApp webhook integration, and dashboard setup. Fixed price: ₹3,500 + GST. Awaiting client checkout.',
        deliverables: [
          'Custom Fine-tuned AI Chatbot Model (RAG on brand docs)',
          'CRM & Lead Capture Webhook Integrations',
          'Multi-channel Deployment (Web Widget & WhatsApp)',
          'Admin Analytics Dashboard & 1 Month Support'
        ],
        estimatedDeliveryDate: '2026-10-25',
      },
      files: [
        {
          id: 'sf-1',
          name: 'system-architecture-brief.pdf',
          type: 'application/pdf',
          size: '3.4 MB',
          url: '#',
        },
        {
          id: 'sf-2',
          name: 'faqs-and-knowledge-base.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: '1.2 MB',
          url: '#',
        }
      ],
    },
    timeline: [
      { step: 'Service Request Sent', timestamp: 'Oct 03, 2026, 11:45 AM', status: 'completed', description: 'Request submitted with project brief and knowledge docs' },
      { step: 'Support Team Review', timestamp: 'Oct 03, 2026, 12:15 PM', status: 'completed', description: 'Assigned to Alex Johnson (Senior Automation Lead)' },
      { step: 'Pricing Fixed by Support', timestamp: 'Oct 03, 2026, 12:30 PM', status: 'completed', description: 'Scope verified and fixed price set to ₹3,500' },
      { step: 'Payment & Checkout', timestamp: 'Pending', status: 'current', description: 'Ready for client checkout to commence setup' },
      { step: 'Fulfillment & Deployment', timestamp: 'Upcoming', status: 'upcoming', description: 'Estimated go-live on or before Oct 25, 2026' },
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
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map((o: Order) => String(o.id)));
      const missingInitial = initialOrders.filter((o) => !existingIds.has(String(o.id)));
      
      let updatedList = [...parsed];
      let needsSave = false;

      if (missingInitial.length > 0) {
        updatedList = [...updatedList, ...missingInitial];
        needsSave = true;
      }

      // Check if any service order exists in the stored list
      const hasService = updatedList.some(
        (o: Order) =>
          o.id === '7' ||
          o.orderType === 'Service' ||
          o.orderType === 'Service Order' ||
          o.contentTypeName === 'Service' ||
          o.contentTypeName === 'Service Request' ||
          o.content?.type === 'service_request'
      );

      if (!hasService) {
        const serviceOrder = initialOrders.find((o) => o.id === '7');
        if (serviceOrder) {
          updatedList = [serviceOrder, ...updatedList];
          needsSave = true;
        }
      }

      // Ensure any service order displays orderType: 'Service' and contentTypeName: 'Service'
      updatedList = updatedList.map((o: Order) => {
        if (
          o.id === '7' ||
          o.orderType === 'Service Order' ||
          o.contentTypeName === 'Service Request' ||
          o.content?.type === 'service_request'
        ) {
          if (o.orderType !== 'Service' || o.contentTypeName !== 'Service') {
            needsSave = true;
            return {
              ...o,
              orderType: 'Service',
              contentTypeName: 'Service',
            };
          }
        }
        return o;
      });

      if (needsSave) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }
      return updatedList;
    }
    return initialOrders;
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

