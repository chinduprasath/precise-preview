
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BarChart, Zap } from 'lucide-react';

const DigitalMarketingSection = () => {
  const services = [
    {
      icon: "🎯",
      title: "PPC Campaigns",
      subtitle: "Google Ads"
    },
    {
      icon: "🔍", 
      title: "SEO Optimization",
      subtitle: "& Ranking"
    },
    {
      icon: "📊",
      title: "Google Analytics",
      subtitle: "Setup"
    },
    {
      icon: "📍",
      title: "Google Business",
      subtitle: "Profile Setup"
    },
    {
      icon: "🎨",
      title: "Design Editors",
      subtitle: "Ad Creatives & Visuals"
    },
    {
      icon: "📣",
      title: "Social Media Campaigns",
      subtitle: "Facebook, Instagram, YouTube, LinkedIn, Pinterest, Snapchat, Twitter"
    }
  ];

  const ottServices = [
    {
      icon: "📺",
      title: "OTT Campaigns",
      subtitle: "Hotstar, Amazon Prime, Jio, Zee5",
      comingSoon: true
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground opacity-0 animate-fadeInUp">
              More Than Just Influencers — Your Full Digital Marketing Partner
            </h2>
            <p className="text-lg text-muted-foreground opacity-0 animate-fadeInUp [animation-delay:100ms]">
              While influencer marketing is our specialty, we also offer powerful digital marketing services to amplify your brand across platforms.
            </p>
            <Button size="lg" className="mt-6 opacity-0 animate-fadeInScale [animation-delay:200ms] transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Explore Our Digital Marketing Services
            </Button>
          </div>

          {/* Right Column - Services Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className={`bg-card text-card-foreground rounded-lg p-4 border border-border hover:shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInLeft [animation-delay:${100 + index * 100}ms]`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl transition-transform duration-300 hover:scale-110">{service.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{service.title}</h3>
                      <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* OTT Services with Coming Soon Badge */}
            <div className="grid grid-cols-1 gap-4">
              {ottServices.map((service, index) => (
                <div 
                  key={index}
                  className="bg-card text-card-foreground rounded-lg p-4 border border-border hover:shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative opacity-0 animate-fadeInScale [animation-delay:700ms]"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl transition-transform duration-300 hover:scale-110">{service.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm">{service.title}</h3>
                        {service.comingSoon && (
                          <Badge variant="warning" className="text-xs animate-pulse">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalMarketingSection;
export { DigitalMarketingSection };
