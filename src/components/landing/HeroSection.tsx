
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen">
      <BackgroundGradientAnimation
        gradientBackgroundStart="hsl(235, 75%, 60%)"
        gradientBackgroundEnd="hsl(222.2, 84%, 4.9%)"
        firstColor="114, 183, 255"
        secondColor="114, 9, 183"
        thirdColor="242, 37, 133"
        fourthColor="255, 51, 102"
        fifthColor="251, 133, 0"
        pointerColor="114, 183, 255"
        containerClassName="absolute inset-0"
      >
        <div className="relative z-10 px-4 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold md:text-5xl text-white">
                  Supercharge Your Brand's Growth with the Right Influencers
                </h1>
                <p className="text-xl text-white/80">
                  Our platform helps emerging brands discover influencers, manage campaigns, and track performance — all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" onClick={() => navigate('/signup')} className="gap-2 bg-white text-primary hover:bg-white/90">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/signin')} className="border-white text-white hover:bg-white hover:text-primary">
                    Sign In
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden flex items-center justify-center border border-white/20">
                  <img 
                    alt="Influencer marketing" 
                    src="/lovable-uploads/286b1bd3-ae57-41f3-ac21-861afcc1272d.jpg" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Join 2500+ brands</p>
                      <p className="text-sm text-gray-600">using our platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </section>
  );
};

export default HeroSection;
export { HeroSection };
