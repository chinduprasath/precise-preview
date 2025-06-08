
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Globe, Award, Heart, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "We believe in genuine connections between brands and creators, fostering authentic relationships that drive real results."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Connecting brands and influencers worldwide to create campaigns that resonate across cultures and communities."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously evolving our platform with cutting-edge technology to stay ahead of industry trends."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering exceptional results and experiences for both brands and content creators."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Influencers" },
    { number: "500+", label: "Brand Partners" },
    { number: "1M+", label: "Campaigns Launched" },
    { number: "50+", label: "Countries Served" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Authentic
            <span className="text-primary block">Brand-Creator Connections</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're on a mission to revolutionize influencer marketing by creating meaningful partnerships that drive real results for brands and creators alike.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To democratize influencer marketing by providing brands of all sizes with the tools and insights they need to connect with authentic creators and measure real impact.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe that every brand has a story worth telling, and every creator has a unique voice that deserves to be heard. Our platform bridges this gap, creating opportunities for meaningful collaborations that benefit everyone involved.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To become the world's most trusted platform for influencer marketing, where authenticity, transparency, and mutual success are at the heart of every campaign.
              </p>
              <p className="text-lg text-muted-foreground">
                We envision a future where influencer marketing is not just about reach and impressions, but about building genuine communities and driving meaningful change in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground text-left">
              <p>
                InfluencerConnect was born from a simple observation: the disconnect between brands seeking authentic promotion and creators looking for meaningful partnerships. Founded in 2023 by a team of marketing professionals and technology experts, we set out to solve this challenge.
              </p>
              <p>
                Our founders experienced firsthand the frustrations of traditional influencer marketing - from fake followers and inflated metrics to poor campaign tracking and ROI measurement. They envisioned a platform that would bring transparency, authenticity, and data-driven insights to the industry.
              </p>
              <p>
                Today, InfluencerConnect serves thousands of brands and creators worldwide, facilitating genuine partnerships that drive real business results. We're proud to be at the forefront of the evolution in influencer marketing, continuously innovating to meet the changing needs of our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the future of influencer marketing. Whether you're a brand or creator, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 InfluencerConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
