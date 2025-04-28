
export type OrderStatus = 'pending' | 'completed' | 'rejected' | 'new';

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
  businessVerified: boolean;
  username: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
}
