import { ServiceOrder, ServiceOrderTeamMember } from '@/types/serviceOrder';
import { addDays, subDays, subHours } from 'date-fns';

export const mockTeamMembers: ServiceOrderTeamMember[] = [
  {
    id: 'tm1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Designer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 'tm2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Marketing Specialist',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 'tm3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'Social Media Manager',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: 'tm4',
    name: 'Jessica Lee',
    email: 'jessica@example.com',
    role: 'Content Creator',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  }
];

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: 'so1',
    orderId: 'ORD-12345',
    serviceType: 'graphics_design',
    serviceTypeDisplay: 'Graphics Design',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    userId: 'user1',
    userType: 'business',
    orderDate: subDays(new Date(), 2).toISOString(),
    status: 'in_progress',
    assignedTo: 'tm1',
    assignedTeamMember: mockTeamMembers[0],
    description: 'Logo design for new fashion brand.',
    requirements: 'Modern, minimalist style with pastel colors. Need both light and dark versions.',
    files: [
      {
        id: 'f1',
        filename: 'brand-guidelines.pdf',
        fileUrl: '#',
        fileType: 'application/pdf',
        uploadedBy: 'user1',
        uploadedAt: subDays(new Date(), 2).toISOString()
      },
      {
        id: 'f2',
        filename: 'reference-logos.zip',
        fileUrl: '#',
        fileType: 'application/zip',
        uploadedBy: 'user1',
        uploadedAt: subDays(new Date(), 2).toISOString()
      }
    ],
    amount: 350,
    currency: 'USD',
    estimatedCompletionDate: addDays(new Date(), 5).toISOString().split('T')[0]
  },
  {
    id: 'so2',
    orderId: 'ORD-12346',
    serviceType: 'social_media',
    serviceTypeDisplay: 'Social Media Campaign',
    userName: 'Emma Johnson',
    userEmail: 'emma@example.com',
    userId: 'user2',
    userType: 'influencer',
    orderDate: subDays(new Date(), 5).toISOString(),
    status: 'pending',
    description: 'Instagram campaign for summer collection.',
    requirements: 'Need planning and execution of a 2-week campaign featuring our summer collection. Target audience is 18-25 year olds.',
    files: [
      {
        id: 'f3',
        filename: 'product-photos.jpg',
        fileUrl: '#',
        fileType: 'image/jpeg',
        uploadedBy: 'user2',
        uploadedAt: subDays(new Date(), 5).toISOString()
      }
    ],
    amount: 1200,
    currency: 'USD',
    estimatedCompletionDate: addDays(new Date(), 14).toISOString().split('T')[0]
  },
  {
    id: 'so3',
    orderId: 'ORD-12347',
    serviceType: 'digital_marketing',
    serviceTypeDisplay: 'Digital Marketing',
    userName: 'Tech Solutions Inc',
    userEmail: 'info@techsolutions.com',
    userId: 'user3',
    userType: 'business',
    orderDate: subDays(new Date(), 10).toISOString(),
    status: 'completed',
    assignedTo: 'tm2',
    assignedTeamMember: mockTeamMembers[1],
    description: 'Google AdWords campaign for SaaS product launch.',
    internalNotes: 'Client has increased budget by 20%. Focus on tech professionals in US and Europe.',
    files: [],
    amount: 2500,
    currency: 'USD',
    estimatedCompletionDate: subDays(new Date(), 2).toISOString().split('T')[0]
  },
  {
    id: 'so4',
    orderId: 'ORD-12348',
    serviceType: 'ott_campaigns',
    serviceTypeDisplay: 'OTT Campaign',
    userName: 'MovieStream',
    userEmail: 'marketing@moviestream.com',
    userId: 'user4',
    userType: 'business',
    orderDate: subHours(new Date(), 12).toISOString(),
    status: 'pending',
    description: 'Promotion campaign for new streaming service.',
    requirements: 'Need advertisements for YouTube, Amazon Prime, and Netflix platforms.',
    files: [],
    amount: 5000,
    currency: 'USD',
    estimatedCompletionDate: addDays(new Date(), 30).toISOString().split('T')[0]
  },
  {
    id: 'so5',
    orderId: 'ORD-12349',
    serviceType: 'graphics_design',
    serviceTypeDisplay: 'Graphics Design',
    userName: 'Green Earth NGO',
    userEmail: 'contact@greenearth.org',
    userId: 'user5',
    userType: 'business',
    orderDate: subDays(new Date(), 1).toISOString(),
    status: 'cancelled',
    assignedTo: 'tm1',
    assignedTeamMember: mockTeamMembers[0],
    description: 'Infographic design for climate change awareness.',
    internalNotes: 'Client cancelled due to budget constraints. Offered 15% discount for future orders.',
    files: [
      {
        id: 'f4',
        filename: 'data-points.xlsx',
        fileUrl: '#',
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedBy: 'user5',
        uploadedAt: subDays(new Date(), 1).toISOString()
      }
    ],
    amount: 250,
    currency: 'USD'
  },
  {
    id: 'so6',
    orderId: 'ORD-12350',
    serviceType: 'social_media',
    serviceTypeDisplay: 'Social Media Campaign',
    userName: 'Fitness First',
    userEmail: 'marketing@fitnessfirst.com',
    userId: 'user6',
    userType: 'business',
    orderDate: subDays(new Date(), 7).toISOString(),
    status: 'in_progress',
    assignedTo: 'tm3',
    assignedTeamMember: mockTeamMembers[2],
    description: 'TikTok campaign for new workout program.',
    requirements: 'Need engaging short-form videos that showcase the workout routines. Target audience is 18-35 year olds interested in fitness.',
    internalNotes: 'Client wants to focus on trending audio and challenges format.',
    files: [],
    amount: 1800,
    currency: 'USD',
    estimatedCompletionDate: addDays(new Date(), 10).toISOString().split('T')[0]
  },
  {
    id: 'so7',
    orderId: 'ORD-12351',
    serviceType: 'digital_marketing',
    serviceTypeDisplay: 'Digital Marketing',
    userName: 'Sofia Martinez',
    userEmail: 'sofia@example.com',
    userId: 'user7',
    userType: 'influencer',
    orderDate: subDays(new Date(), 3).toISOString(),
    status: 'pending',
    description: 'SEO optimization for personal blog.',
    requirements: 'Need to improve search rankings for fashion and lifestyle keywords.',
    files: [],
    amount: 500,
    currency: 'USD',
    estimatedCompletionDate: addDays(new Date(), 7).toISOString().split('T')[0]
  }
];
