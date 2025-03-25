
export type ServiceType = {
  id: string;
  name: string;
  icon: string;
  category: 'designers' | 'marketing' | 'social' | 'ott';
};

export type ServiceCategoryType = {
  id: string;
  name: string;
  services: ServiceType[];
};

export type ServiceFormData = {
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
  timeline: string;
};
