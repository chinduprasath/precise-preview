
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
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
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative">
      <BackgroundGradientAnimation
        gradientBackgroundStart="hsl(235, 75%, 60%)"
        gradientBackgroundEnd="hsl(222.2, 84%, 4.9%)"
        firstColor="114, 183, 255"
        secondColor="114, 9, 183"
        thirdColor="242, 37, 133"
        fourthColor="255, 51, 102"
        fifthColor="251, 133, 0"
        pointerColor="114, 183, 255"
        containerClassName="fixed inset-0"
      >
        <div className="relative z-10 min-h-screen bg-background/80 backdrop-blur-sm text-foreground transition-colors duration-300">
          <LandingHeader />
          <HeroSection />
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
      </BackgroundGradientAnimation>
    </div>
  );
};

export default LandingPage;
