
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ServiceCategories from '@/components/services/ServiceCategories';
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceType } from '@/types/service';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
                <ServiceCategories onSelectService={setSelectedService} selectedService={selectedService} />
              </div>
              <div className="bg-card rounded-lg shadow border border-border">
                {selectedService ? (
                  <ServiceForm service={selectedService} />
                ) : (
                  <div className="p-6 flex items-center justify-center h-full">
                    <p className="text-muted-foreground text-center">
                      Select a service from the left to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServicesPage;
