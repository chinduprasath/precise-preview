
import React from 'react';
import { serviceCategories } from '@/data/services';
import { ServiceType } from '@/types/service';

interface ServiceCategoriesProps {
  onSelectService: (service: ServiceType) => void;
  selectedService: ServiceType | null;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ onSelectService, selectedService }) => {
  return (
    <div className="p-4">
      {serviceCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {category.services.map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedService?.id === service.id
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
