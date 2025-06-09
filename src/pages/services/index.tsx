import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ServiceCategories from '@/components/services/ServiceCategories';
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceType, ServiceCategoryType } from '@/types/service';
import { useTheme } from '@/components/theme-provider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ServicesPage = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [showComingSoonForm, setShowComingSoonForm] = useState(false);
  const [email, setEmail] = useState('');
  const { resolvedTheme } = useTheme();

  const handleCategorySelect = (category: ServiceCategoryType) => {
    if (category.comingSoon) {
      setSelectedService(null);
      setShowComingSoonForm(true);
    } else {
      setShowComingSoonForm(false);
      // For now, we will not automatically select the first service in the category
      // Instead, the user needs to click on a specific service item
    }
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setShowComingSoonForm(false);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted for coming soon feature:', email);
    alert(`Thank you for your interest! We will notify you at ${email} when this feature launches.`);
    setEmail(''); // Clear the input
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                <ServiceCategories 
                  onSelectCategory={handleCategorySelect}
                  onSelectService={handleServiceSelect}
                  selectedService={selectedService}
                  onSelectComingSoonCategory={handleCategorySelect}
                />
              </div>
              <div className="bg-card rounded-lg shadow-sm border border-border service-card">
                {showComingSoonForm ? (
                  <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-xl font-semibold mb-4">Coming Soon!</h2>
                    <p className="text-muted-foreground mb-4">
                      Are you interested? Please provide your email address to be notified when this feature launches.
                    </p>
                    <form onSubmit={handleEmailSubmit} className="w-full max-w-sm space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">Notify Me</Button>
                    </form>
                  </div>
                ) : selectedService ? (
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
