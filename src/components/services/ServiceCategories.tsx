import React from 'react';
import { serviceCategories } from '@/data/services';
import { ServiceType, ServiceCategoryType } from '@/types/service';

interface ServiceCategoriesProps {
  onSelectCategory: (category: ServiceCategoryType) => void;
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
  onSelectComingSoonCategory: (category: ServiceCategoryType) => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  onSelectCategory,
  onSelectService,
  selectedService,
  onSelectComingSoonCategory,
}) => {
  return (
    <div className="p-4">
      {serviceCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 flex items-center gap-2 cursor-pointer"
            onClick={() => onSelectCategory(category)}
          >
            {category.name}
            {category.comingSoon && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Coming Soon
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {category.services.map((service) => (
              <div
                key={service.id}
                onClick={() =>
                  category.comingSoon
                    ? onSelectComingSoonCategory(category)
                    : onSelectService(service)
                }
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedService?.id === service.id && !category.comingSoon
                    ? 'bg-primary/10 border border-primary'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center mb-2 text-xl">
                  {service.icon}
                </div>
                <span className="text-sm text-center">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCategories;
