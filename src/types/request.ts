
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
  googleMapsLink?: string;
  affiliateLinks?: string[];
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
  content?: RequestContent; // Dynamic content based on content type
}
