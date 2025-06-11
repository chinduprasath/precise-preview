
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import { HeroWithMockup } from '@/components/ui/hero-with-mockup';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import StatsSection from '@/components/landing/StatsSection';
import DigitalMarketingSection from '@/components/landing/DigitalMarketingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import AboutSection from '@/components/landing/AboutSection';
import ContactSection from '@/components/landing/ContactSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import { ArrowRight, User } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <LandingHeader />
      <HeroWithMockup
        title="Supercharge Your Brand's Growth with the Right Influencers"
        description="Our platform helps emerging brands discover influencers, manage campaigns, and track performance — all in one place."
        primaryCta={{
          text: "Get Started",
          href: "/signup"
        }}
        secondaryCta={{
          text: "Sign In",
          href: "/signin",
          icon: <User className="mr-2 h-4 w-4" />
        }}
        mockupImage={{
          src: "/lovable-uploads/286b1bd3-ae57-41f3-ac21-861afcc1272d.jpg",
          alt: "Influencer marketing platform dashboard",
          width: 1248,
          height: 765
        }}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <DigitalMarketingSection />
      <TestimonialsSection />
      <PricingSection />
      <AboutSection id="about" />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
