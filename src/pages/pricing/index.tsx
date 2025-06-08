
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Check, Star, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';

const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      icon: Users,
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with influencer marketing",
      badge: null,
      features: [
        "Up to 5 influencer searches per month",
        "Basic influencer profiles",
        "Limited audience insights",
        "Email support",
        "Standard search filters",
        "Campaign tracking (up to 2 campaigns)"
      ],
      notIncluded: [
        "Advanced analytics",
        "Fake follower detection",
        "Priority support",
        "Custom reports"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      icon: Star,
      price: "$99",
      period: "per month",
      description: "Ideal for growing businesses and marketing teams",
      badge: "Most Popular",
      features: [
        "Unlimited influencer searches",
        "Advanced audience analytics",
        "Fake follower detection",
        "ROI measurement tools",
        "Priority email support",
        "Campaign management (up to 20 campaigns)",
        "Custom reports",
        "Advanced search filters",
        "Performance tracking",
        "Content approval workflow"
      ],
      notIncluded: [
        "Dedicated account manager",
        "Custom integrations",
        "White-label options"
      ],
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "Custom",
      period: "contact us",
      description: "For large organizations with advanced needs",
      badge: "Best Value",
      features: [
        "Everything in Pro",
        "Unlimited campaigns",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "White-label options",
        "Advanced security features",
        "Team collaboration tools",
        "Custom training sessions",
        "API access",
        "Advanced reporting dashboard",
        "Multi-brand management"
      ],
      notIncluded: [],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Influencer Searches",
      free: "5 per month",
      pro: "Unlimited",
      enterprise: "Unlimited"
    },
    {
      feature: "Campaign Management",
      free: "2 campaigns",
      pro: "20 campaigns",
      enterprise: "Unlimited"
    },
    {
      feature: "Audience Analytics",
      free: "Basic",
      pro: "Advanced",
      enterprise: "Advanced + Custom"
    },
    {
      feature: "Fake Follower Detection",
      free: "❌",
      pro: "✅",
      enterprise: "✅"
    },
    {
      feature: "ROI Measurement",
      free: "❌",
      pro: "✅",
      enterprise: "✅ + Advanced"
    },
    {
      feature: "Custom Reports",
      free: "❌",
      pro: "✅",
      enterprise: "✅ + White-label"
    },
    {
      feature: "Support",
      free: "Email",
      pro: "Priority Email",
      enterprise: "24/7 Phone + Dedicated Manager"
    },
    {
      feature: "API Access",
      free: "❌",
      pro: "❌",
      enterprise: "✅"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent
            <span className="text-primary block">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your influencer marketing needs. Start free and scale as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Badge variant="secondary" className="text-base px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              14-day free trial on all paid plans
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              No setup fees • Cancel anytime
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-2">/{plan.period}</span>}
                  </div>
                  <CardDescription className="text-base mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start opacity-50">
                        <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-6">
                    <Button
                      className="w-full"
                      variant={plan.buttonVariant}
                      size="lg"
                      onClick={() => plan.name === 'Enterprise' ? navigate('/contact') : navigate('/signup')}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Detailed Feature Comparison</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare all features across our pricing plans to find the perfect fit for your needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full bg-background rounded-lg border">
              <div className="grid grid-cols-4 gap-4 p-6 border-b bg-muted/50">
                <div className="font-semibold">Feature</div>
                <div className="font-semibold text-center">Free</div>
                <div className="font-semibold text-center">Pro</div>
                <div className="font-semibold text-center">Enterprise</div>
              </div>
              {comparisonFeatures.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-6 border-b last:border-b-0">
                  <div className="font-medium">{row.feature}</div>
                  <div className="text-center text-sm">{row.free}</div>
                  <div className="text-center text-sm">{row.pro}</div>
                  <div className="text-center text-sm">{row.enterprise}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pricing FAQ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No setup fees, ever. You only pay the monthly or annual subscription cost for your chosen plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise customers. All payments are secure and encrypted.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer annual discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Save 20% when you pay annually. Contact our sales team for custom Enterprise pricing and additional discounts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of brands and creators who trust InfluencerConnect for their marketing success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Start Your Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
              Talk to Sales
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

export default PricingPage;
