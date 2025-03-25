
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'paid';

export type ServiceType = 'post' | 'story' | 'reel' | 'video' | 'short';

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'tiktok';

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
  platform: SocialPlatform;
  description: string;
  price: number;
  currency?: string;
  status: RequestStatus;
  dateRequested?: string;
  createdAt: string;
  updatedAt: string;
}
