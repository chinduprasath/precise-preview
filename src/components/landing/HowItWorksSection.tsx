
import React from 'react';

const HowItWorksSection = () => {
  return (
    <section className="px-4 py-20 bg-card">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-background rounded-xl border border-border relative">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search</h3>
            <p className="text-muted-foreground">
              Find influencers based on niche, follower count, and engagement rates
            </p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border relative">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Order</h3>
            <p className="text-muted-foreground">
              Place orders directly with influencers based on their pricing
            </p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border relative">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Results</h3>
            <p className="text-muted-foreground">
              Monitor campaign metrics and ROI in real-time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
export { HowItWorksSection };
