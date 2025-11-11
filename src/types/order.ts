
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
  location?: string;
  offers?: {
    food?: boolean;
    travel?: boolean;
    stay?: boolean;
    other?: string[];
  };
}

export interface OrderContent {
  type: OrderContentType;
  files?: { id: string; name: string; type: string; size: string; url?: string }[];
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
  orderType?: string;
  businessVerified: boolean;
  username: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
  content?: OrderContent; // Dynamic content based on order type
  socialMediaLinks?: SocialMediaLinks; // Social media post URLs
}

export interface CouponCode {
  code: string;
  discount: number; // percentage discount
  isValid: boolean;
}
