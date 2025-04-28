
export type OrderStatus = 'pending_checkout' | 'pending' | 'completed' | 'new';

export interface Order {
  id: string;
  orderNumber: string;
  date: string | null;
  url: string | null;
  status: OrderStatus;
  scheduledDate: string | null;
  category: string | null;
  productService: string | null;
  businessVerified: boolean;
  username: string | null;
  createdAt: string;
  updatedAt: string;
}
