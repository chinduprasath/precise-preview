
import { Order } from '@/types/order';

export const orderData: Order[] = [
  {
    id: '1',
    username: 'Username#1',
    orderDate: '01/03/2025 06:25:23 PM',
    scheduledDate: 'Mon, 03/04/2025',
    scheduledTime: '03:35:00 AM',
    category: 'Fashion',
    productService: 'Service',
    businessVerified: true,
    amount: 800,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'Username#1',
    orderDate: '01/03/2025 06:25:23 PM',
    scheduledDate: 'Mon, 03/04/2025',
    scheduledTime: '03:35:00 AM',
    category: 'Ecommerce',
    productService: 'Products',
    businessVerified: true,
    amount: 800,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    username: 'Username#1',
    orderDate: '01/03/2025 06:25:23 PM',
    scheduledDate: 'Mon, 03/04/2025',
    scheduledTime: '03:35:00 AM',
    category: 'Fashion',
    productService: 'Service',
    businessVerified: true,
    amount: 800,
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    username: 'Username#1',
    orderDate: '01/03/2025 06:25:23 PM',
    scheduledDate: 'Mon, 03/04/2025',
    scheduledTime: '03:35:00 AM',
    category: 'Tech',
    productService: 'Review',
    businessVerified: false,
    amount: 1200,
    status: 'rejected',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
