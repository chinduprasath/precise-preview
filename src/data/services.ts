import { ServiceCategoryType, ServiceType } from '@/types/service';

export const services: ServiceType[] = [
  // Designers Category
  { id: '1', name: 'Posts', icon: '📱', category: 'designers' },
  { id: '2', name: 'Reels/Shorts', icon: '🎬', category: 'designers' },
  { id: '3', name: 'Logo Design', icon: '🍃', category: 'designers' },
  { id: '4', name: 'Logo Animation', icon: '💰', category: 'designers' },
  
  // Marketing Category
  { id: '5', name: 'Pay per click', icon: '🖱️', category: 'marketing' },
  { id: '6', name: 'SEO Ranking', icon: '🔍', category: 'marketing' },
  { id: '7', name: 'Google Analytics', icon: '📊', category: 'marketing' },
  { id: '8', name: 'Google Business', icon: '📈', category: 'marketing' },
  
  // Social Media Category
  { id: '9', name: 'Google Ads', icon: 'G', category: 'social' },
  { id: '10', name: 'Instagram', icon: '📸', category: 'social' },
  { id: '11', name: 'Facebook', icon: 'f', category: 'social' },
  { id: '12', name: 'Youtube', icon: '▶️', category: 'social' },
  { id: '13', name: 'LinkedIn', icon: 'in', category: 'social' },
  { id: '14', name: 'Pinterest', icon: 'P', category: 'social' },
  { id: '15', name: 'Snapchat', icon: '👻', category: 'social' },
  { id: '16', name: 'Twitter', icon: '🐦', category: 'social' },
  
  // AI & Automation Category
  { id: '21', name: 'AI chatbots', icon: '🤖', category: 'ai_automation' },
  { id: '22', name: 'AI marketing', icon: '🧠', category: 'ai_automation' },
  { id: '23', name: 'CRM Automation', icon: '⚙️', category: 'ai_automation' },
  { id: '24', name: 'Whatsapp Automation', icon: '💬', category: 'ai_automation' },
  
  // OTT Category
  { id: '17', name: 'Hotstar', icon: 'H', category: 'ott' },
  { id: '18', name: 'Amazon', icon: 'A', category: 'ott' },
  { id: '19', name: 'Jio', icon: 'J', category: 'ott' },
  { id: '20', name: 'Zee5', icon: 'Z', category: 'ott' },
];

export const serviceCategories: ServiceCategoryType[] = [
  {
    id: 'designers',
    name: 'Design Services',
    services: services.filter(service => service.category === 'designers')
  },
  {
    id: 'marketing',
    name: 'Marketing Services',
    services: services.filter(service => service.category === 'marketing')
  },
  {
    id: 'social',
    name: 'Social Media Campaigns',
    services: services.filter(service => service.category === 'social')
  },
  {
    id: 'ai_automation',
    name: 'AI & Automation',
    services: services.filter(service => service.category === 'ai_automation')
  },
  {
    id: 'ott',
    name: 'OTT Campaigns',
    services: services.filter(service => service.category === 'ott'),
    comingSoon: true
  }
];
