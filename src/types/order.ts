
export type OrderStatus = 'pending' | 'completed' | 'rejected' | 'new' | 'pending_checkout';

export type OrderContentType = 'upload_files' | 'provided_content' | 'polls' | 'visit_promote';

export interface PollQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface VisitDetails {
  preferredDates?: string[];
  timeSlot?: string;
  venueName?: string;
  fullAddress?: string;
  landmarkInfo?: string;
  travelReimbursement?: boolean;
  travelAmount?: string;
  foodProvided?: boolean;
  foodDetails?: string;
  stayProvided?: boolean;
  stayDetails?: string;
  giftsVouchers?: string;
  otherPerks?: string;
  contentDescription?: string;
  hashtags?: string;
  handlesToTag?: string;
  specialGuidelines?: string;
  location?: string;
  offers?: {
    food?: boolean;
    travel?: boolean;
    stay?: boolean;
    other?: string[];
  };
}

export interface OrderFileAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
}

export interface OrderContent {
  type: OrderContentType;
  files?: OrderFileAttachment[];
  description?: string;
  polls?: PollQuestion[];
  visitDetails?: VisitDetails;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
}

export interface OrderPricing {
  basePrice: number;
  platformFee: number;
  couponCode?: string;
  couponDiscount: number;
  gst: number;
  total: number;
}

export interface InfluencerProfileSummary {
  name: string;
  avatar: string;
  category: string;
  location: string;
  verified?: boolean;
  followers?: { platform: string; value: string }[];
}

export interface OrderTimelineStep {
  step: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
  description?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  url: string | null;
  status: OrderStatus;
  scheduledDate: string | null;
  scheduledTime: string | null;
  category: string | null;
  productService: string | null;
  orderType?: string; // e.g. "Platform Based", "Custom Package"
  contentTypeName?: string; // e.g. "Post Image/Video", "Polls", "Visit & Promote"
  platform?: string; // e.g. "instagram", "facebook", "youtube", "twitter"
  businessVerified: boolean;
  username: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  affiliateLink?: string;
  notes?: string;
  influencer?: InfluencerProfileSummary;
  pricing?: OrderPricing;
  content?: OrderContent; // Dynamic content based on order type
  socialMediaLinks?: SocialMediaLinks; // Social media post URLs
  timeline?: OrderTimelineStep[];
}

export interface CouponCode {
  code: string;
  discount: number; // percentage discount
  isValid: boolean;
}

