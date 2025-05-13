
import React from 'react';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';
import { Github } from 'lucide-react';

const HeroSection = () => {
  return (
    <HeroWithMockup
      title="Find the Right Influencer for Your Brand"
      description="Connect with top influencers across social platforms to amplify your brand's reach and engagement."
      primaryCta={{
        text: "Get Started",
        href: "/signup",
      }}
      secondaryCta={{
        text: "Sign In",
        href: "/signin",
        icon: undefined,
      }}
      mockupImage={{
        alt: "Influencer marketing",
        width: 1248,
        height: 765,
        src: "/lovable-uploads/286b1bd3-ae57-41f3-ac21-861afcc1272d.jpg"
      }}
    />
  );
};

export default HeroSection;
export { HeroSection };
