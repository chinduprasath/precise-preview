
export interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  caption: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface UserPromotion {
  id: string;
  userId: string;
  userName: string;
  userType: 'business' | 'influencer';
  userProfilePic?: string;
  offerId: string;
  generatedUrl: string;
  platform: 'Instagram' | 'Facebook' | 'YouTube' | 'Twitter' | 'TikTok';
  postTime?: string;
  expiryTime?: string;
  status: 'Live' | 'Removed' | 'Expired' | 'Pending';
  timeRemaining?: string;
  engagement: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
  rewardStatus: 'Given' | 'Pending';
  rewardType: 'Free Subscription' | 'Commission-Free Withdrawal';
}
