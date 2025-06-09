
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BarChart2, Shield, Target, TrendingUp, Users, Eye, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import DigitalMarketingSection from '@/components/landing/DigitalMarketingSection';
import Footer from '@/components/landing/Footer';

const FeaturesPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Influencer Discovery",
      description: "Find the perfect influencers for your brand with advanced search filters including location, niche, engagement rate, and audience demographics.",
      benefits: ["Advanced filtering options", "Real-time data updates", "Verified profiles", "Global reach"]
    },
    {
      icon: BarChart2,
      title: "Audience Analytics",
      description: "Get deep insights into influencer audiences with detailed demographics, interests, and engagement patterns to ensure perfect brand alignment.",
      benefits: ["Demographic breakdowns", "Interest analysis", "Engagement tracking", "Growth trends"]
    },
    {
      icon: Shield,
      title: "Fake Follower Detection",
      description: "Protect your investment with our AI-powered fake follower detection system that ensures you work with authentic influencers.",
      benefits: ["AI-powered analysis", "Authenticity scores", "Risk assessment", "Quality assurance"]
    },
    {
      icon: Target,
      title: "Campaign Tracking",
      description: "Monitor your influencer campaigns in real-time with comprehensive tracking tools that measure performance across all platforms.",
      benefits: ["Real-time monitoring", "Multi-platform support", "Performance metrics", "Automated reporting"]
    },
    {
      icon: TrendingUp,
      title: "ROI Measurement",
      description: "Calculate the true return on investment of your influencer campaigns with detailed analytics and conversion tracking.",
      benefits: ["Revenue tracking", "Cost analysis", "Performance benchmarks", "Custom reports"]
    },
    {
      icon: Users,
      title: "Campaign Management",
      description: "Streamline your influencer marketing workflow with tools for communication, content approval, and payment processing.",
      benefits: ["Centralized communication", "Content approval workflow", "Automated payments", "Timeline management"]
    },
    {
      icon: Eye,
      title: "Content Performance",
      description: "Track how your sponsored content performs across different platforms with detailed engagement and reach metrics.",
      benefits: ["Cross-platform analytics", "Engagement metrics", "Reach analysis", "Content optimization"]
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access a worldwide network of verified influencers across all major social media platforms and niches.",
      benefits: ["Worldwide coverage", "Multi-platform support", "Verified profiles", "Diverse niches"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Powerful Features for
            <span className="text-primary block">Influencer Marketing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover everything you need to run successful influencer marketing campaigns, from discovery to ROI measurement.
          </p>
          <Button size="lg" onClick={() => navigate('/signup')} className="mr-4">
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
            Schedule Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Marketing Services Section */}
      <DigitalMarketingSection />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Influencer Marketing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of brands using InfluencerConnect to run successful campaigns and measure real ROI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')}>
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
