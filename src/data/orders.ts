
import { Order } from '@/types/order';

export const orderData: Order[] = [
  // Pending Checkout Orders
  {
    id: '1',
    orderNumber: '4292424244',
    date: '2025-04-01T10:15:00',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2025-04-15',
    scheduledTime: '14:30:00',
    category: 'Fashion',
    productService: 'Fashion Service',
    orderType: 'post',
    businessVerified: true,
    username: 'Username#1',
    amount: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    orderNumber: '4292424245',
    date: '2025-04-02T11:30:00',
    url: null,
    status: 'pending_checkout',
    scheduledDate: '2025-04-16',
    scheduledTime: '15:45:00',
    category: 'Tech',
    productService: 'Tech Review',
    orderType: 'reel',
    businessVerified: false,
    username: 'Username#2',
    amount: 1500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Posted Orders
  {
    id: '3',
    orderNumber: '4292424246',
    date: 'Mon, July 3rd',
    url: 'https://helloworld/url1',
    status: 'completed',
    scheduledDate: null,
    scheduledTime: null,
    category: null,
    productService: null,
    orderType: 'short_video',
    businessVerified: false,
    username: 'Username#3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    orderNumber: '4292424247',
    date: 'Mon, July 4th',
    url: 'https://helloworld/url2',
    status: 'completed',
    scheduledDate: null,
    scheduledTime: null,
    category: null,
    productService: null,
    orderType: 'polls',
    businessVerified: true,
    username: 'Username#4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
