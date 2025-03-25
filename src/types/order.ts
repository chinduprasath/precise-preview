
export type OrderStatus = 'pending' | 'completed' | 'new';

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  url: string;
  status: OrderStatus;
};
