
export type TicketStatus = 'New' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Technical' | 'Payment' | 'Collaboration' | 'Account Issue' | 'Other';
export type UserType = 'business' | 'influencer' | 'admin';

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userType: UserType;
  message: string;
  attachments?: { name: string; url: string; type: string }[];
  createdAt: string;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userType: UserType;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string;
  messages: TicketMessage[];
}
