
import React from 'react';

const HowItWorksSection = () => {
  return (
    <section className="px-4 py-20 bg-card">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 opacity-0 animate-fadeInUp">
          Why Brands Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-background rounded-xl border border-border relative transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInUp [animation-delay:100ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <span className="text-xl font-bold text-primary">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified influencers</h3>
            <p className="text-muted-foreground">
              Only authentic and high-quality creators across top social platforms.
            </p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border relative transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInUp [animation-delay:200ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <span className="text-xl font-bold text-primary">⭐</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Trusted by early adopters</h3>
            <p className="text-muted-foreground">
              Emerging and growing brands already use our platform to scale their influencer marketing.
            </p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border relative transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 opacity-0 animate-fadeInUp [animation-delay:300ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <span className="text-xl font-bold text-primary">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rated highly by early users</h3>
            <p className="text-muted-foreground">
              Built for simplicity, with a smooth experience marketers appreciate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
export { HowItWorksSection };
