
export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Order {
  id: string;
  username: string;
  orderDate: string;
  scheduledDate: string;
  scheduledTime: string;
  category: string;
  productService: string;
  businessVerified: boolean;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  url?: string;
}
