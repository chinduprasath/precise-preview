
import React from 'react';
import { Users, CheckCircle, BarChart2 } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-appear opacity-0 [animation-delay:200ms]">
            How InfluexKonnect Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-appear opacity-0 [animation-delay:400ms]">
            Our platform makes it easy to discover, connect, and collaborate with influencers who align with your brand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-card text-card-foreground rounded-xl p-8 shadow-sm border border-border transition-all hover:shadow-md hover:scale-105 duration-300 animate-appear opacity-0 [animation-delay:600ms]">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-scale-in [animation-delay:800ms]">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 animate-slide-in-left [animation-delay:900ms]">Discover Influencers</h3>
            <p className="text-muted-foreground animate-slide-in-left [animation-delay:1000ms]">
              Browse thousands of influencers across various niches, demographics, and platforms to find your perfect match.
            </p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-xl p-8 shadow-sm border border-border transition-all hover:shadow-md hover:scale-105 duration-300 animate-appear opacity-0 [animation-delay:800ms]">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-scale-in [animation-delay:1000ms]">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 animate-slide-in-left [animation-delay:1100ms]">Connect & Collaborate</h3>
            <p className="text-muted-foreground animate-slide-in-left [animation-delay:1200ms]">
              Send requests directly to influencers, negotiate terms, and manage your campaigns all in one place.
            </p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-xl p-8 shadow-sm border border-border transition-all hover:shadow-md hover:scale-105 duration-300 animate-appear opacity-0 [animation-delay:1000ms]">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-scale-in [animation-delay:1200ms]">
              <BarChart2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 animate-slide-in-left [animation-delay:1300ms]">Track Results</h3>
            <p className="text-muted-foreground animate-slide-in-left [animation-delay:1400ms]">
              Measure campaign performance with detailed analytics and reporting to optimize your influencer marketing ROI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
export { FeaturesSection };
