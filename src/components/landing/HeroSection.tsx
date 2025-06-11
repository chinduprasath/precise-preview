
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-20 md:py-32 bg-gradient-to-r from-primary-foreground to-background dark:from-gray-900 dark:to-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold md:text-5xl animate-appear opacity-0 [animation-delay:200ms]">
              Supercharge Your Brand's Growth with the Right Influencers
            </h1>
            <p className="text-xl text-muted-foreground animate-appear opacity-0 [animation-delay:400ms] animate-slide-in-left">
              Our platform helps emerging brands discover influencers, manage campaigns, and track performance — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-appear opacity-0 [animation-delay:600ms]">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')} 
                className="gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-scale-in"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/signin')}
                className="transition-all duration-300 hover:scale-105 hover:shadow-md animate-scale-in [animation-delay:100ms]"
              >
                Sign In
              </Button>
            </div>
          </div>
          <div className="relative animate-slide-in-right opacity-0 [animation-delay:800ms]">
            <div className="aspect-video bg-primary/10 dark:bg-primary/5 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                alt="Influencer marketing" 
                src="/lovable-uploads/286b1bd3-ae57-41f3-ac21-861afcc1272d.jpg" 
                className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border animate-appear opacity-0 [animation-delay:1200ms]">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-background dark:border-gray-800 flex items-center justify-center animate-appear opacity-0"
                      style={{ animationDelay: `${1400 + i * 100}ms` }}
                    >
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium">Join 2500+ brands</p>
                  <p className="text-sm text-muted-foreground">using our platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
export { HeroSection };
