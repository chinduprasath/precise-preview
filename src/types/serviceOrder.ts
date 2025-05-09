
import { ServiceType } from './service';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type ServiceOrderFile = {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
};

export type ServiceOrderTeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

export type ServiceOrder = {
  id: string;
  orderId: string;
  serviceType: 'graphics_design' | 'digital_marketing' | 'social_media' | 'ott_campaigns';
  serviceTypeDisplay: string;
  userName: string;
  userEmail: string;
  userId: string;
  userType: 'business' | 'influencer';
  orderDate: string;
  status: OrderStatus;
  assignedTo?: string;
  assignedTeamMember?: ServiceOrderTeamMember;
  description?: string;
  internalNotes?: string;
  files?: ServiceOrderFile[];
  amount?: number;
  currency?: string;
  requirements?: string;
};
