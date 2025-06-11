
import React from 'react';

const HowItWorksSection = () => {
  return (
    <section className="px-4 py-20 bg-card">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 animate-appear opacity-0 [animation-delay:200ms]">
          Why Brands Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-background rounded-xl border border-border relative transition-all hover:shadow-md hover:scale-105 duration-300 animate-appear opacity-0 [animation-delay:400ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-scale-in [animation-delay:600ms]">
              <span className="text-xl font-bold text-primary">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 animate-slide-in-left [animation-delay:700ms]">Verified influencers</h3>
            <p className="text-muted-foreground animate-slide-in-left [animation-delay:800ms]">
              Only authentic and high-quality creators across top social platforms.
            </p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border relative transition-all hover:shadow-md hover:scale-105 duration-300 animate-appear opacity-0 [animation-delay:600ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-scale-in [animation-delay:800ms]">
              <span className="text-xl font-bold text-primary">⭐</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 animate-slide-in-left [animation-delay:900ms]">Trusted by early adopters</h3>
            <p className="text-muted-foreground animate-slide-in-left [animation-delay:1000ms]">
              Emerging and growing brands already use our platform to scale their influencer marketing.
            </p>
          </div>
          <div className="p-6 bg-background rounded-xl border border-border relative transition-all hover:shadow-md hover:scale-105 duration-300 animate-appear opacity-0 [animation-delay:800ms]">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-scale-in [animation-delay:1000ms]">
              <span className="text-xl font-bold text-primary">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 animate-slide-in-left [animation-delay:1100ms]">Rated highly by early users</h3>
            <p className="text-muted-foreground animate-slide-in-left [animation-delay:1200ms]">
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
