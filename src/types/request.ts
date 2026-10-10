
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'paid';

export type ServiceType = 'post' | 'story' | 'reel' | 'video' | 'short';

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'tiktok';

export type ContentType = 'upload_files' | 'provided_content' | 'polls' | 'visit_promote';

export interface PollQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface VisitPromoteDetails {
  venueName?: string;
  fullAddress?: string;
  landmarkInfo?: string;
  preferredDates?: string[];
  timeSlot?: string;
  offers?: string;
  guidelines?: string;
  googleMapsLink?: string;
  affiliateLinks?: string[];
  travelReimbursement?: boolean;
  travelAmount?: string;
  foodProvided?: boolean;
  foodDetails?: string;
  stayProvided?: boolean;
  stayDetails?: string;
  contentDescription?: string;
  hashtags?: string;
  handlesToTag?: string;
  specialGuidelines?: string;
}

export interface RequestContent {
  type: ContentType;
  files?: string[]; // URLs to uploaded files
  description?: string; // For provided content
  polls?: PollQuestion[]; // For poll content
  visitPromote?: VisitPromoteDetails; // For visit & promote
}

export interface RequestPrice {
  serviceType: ServiceType;
  platform: SocialPlatform;
  price: number;
}

export interface BusinessInfo {
  businessName: string;
  category: string;
  serviceType: string;
  website: string;
  address: string;
  accountManagement: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface DeliveredServiceInfo {
  deliveryNotes?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  isFilled?: boolean;
  completedAt?: string;
}

export interface InfluencerRequest {
  id: string;
  businessId: string;
  businessName: string;
  influencerId: string;
  influencerName: string;
  influencerImage?: string;
  serviceType: ServiceType;
  platform: SocialPlatform | SocialPlatform[]; // Support multi-platform for visit & promote
  description: string;
  price: number;
  currency?: string;
  status: RequestStatus;
  dateRequested?: string;
  createdAt: string;
  updatedAt: string;
  orderType?: string; // Custom package name or image 2 value e.g. "Post Image/Video", "Reels/Shorts", "Polls", "Visit & Promote"
  content?: RequestContent; // Dynamic content based on content type
  businessInfo?: BusinessInfo; // Business details matching business dashboard
  priceNote?: string; // Note or reason for custom price proposal
  deliveredService?: DeliveredServiceInfo; // Delivered links and notes
}
