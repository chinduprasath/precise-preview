
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="bg-primary py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 opacity-0 animate-fadeInUp">
          Ready to Transform Your Marketing?
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto opacity-0 animate-fadeInUp [animation-delay:100ms]">
          Join thousands of businesses who have already revolutionized their marketing with InfluexKonnect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fadeInScale [animation-delay:200ms]">
          <Link to="/signup">
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-8 py-6 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Sign Up Now
            </Button>
          </Link>
          <Link to="/signin">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
export { CTASection };
