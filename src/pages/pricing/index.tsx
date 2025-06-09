import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Zap, Crown, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '@/components/landing/LandingHeader';
import Footer from '@/components/landing/Footer';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

const PricingPage = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      icon: Star,
      price: "$29",
      period: "per month",
      description: "Perfect for small businesses getting started with influencer marketing",
      features: [
        "Up to 5 influencer searches per month",
        "Basic campaign analytics",
        "Email support",
        "Access to micro-influencers",
        "Campaign templates"
      ],
      limitations: [
        "No advanced filtering",
        "Limited to 1 active campaign",
        "No dedicated account manager"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      icon: Zap,
      price: "$99",
      period: "per month",
      description: "Ideal for growing businesses ready to scale their influencer marketing",
      features: [
        "Unlimited influencer searches",
        "Advanced analytics & reporting",
        "Priority email support",
        "Access to all influencer tiers",
        "Campaign management tools",
        "A/B testing capabilities",
        "Custom campaign templates",
        "API access"
      ],
      limitations: [
        "No dedicated account manager"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "Custom",
      period: "pricing",
      description: "Comprehensive solution for large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "Advanced team management",
        "Custom reporting",
        "SLA guarantees",
        "Training & onboarding"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated."
    },
    {
      question: "Is there a free trial?",
      answer: "We offer a 14-day free trial for all new users. No credit card required to start your trial."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "You can cancel your subscription at any time. There are no cancellation fees or long-term contracts."
    }
  ];

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
        <div className="relative z-10 min-h-screen bg-background/80 backdrop-blur-sm">
          <LandingHeader />

          {/* Hero Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Simple, Transparent
                <span className="block">Pricing Plans</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan for your business. Start with a free trial and scale as you grow.
              </p>
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 text-white border-white/30">
                  <Rocket className="w-4 h-4 mr-2" />
                  All plans include 14-day free trial
                </Badge>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <Card 
                    key={index} 
                    className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center pb-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <plan.icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.period && (
                          <span className="text-muted-foreground ml-2">/{plan.period}</span>
                        )}
                      </div>
                      <CardDescription className="mt-2 text-base">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {plan.limitations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Limitations:</h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, idx) => (
                              <li key={idx} className="flex items-start">
                                <X className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button 
                        className="w-full mt-8" 
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => {
                          if (plan.name === "Enterprise") {
                            navigate('/contact');
                          } else {
                            navigate('/signup');
                          }
                        }}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Features Comparison */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Platform?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our platform provides everything you need to run successful influencer marketing campaigns.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Verified Influencers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      All influencers are vetted for authenticity and quality, ensuring you work with real creators who drive genuine engagement.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Advanced Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Track campaign performance with detailed metrics, ROI calculations, and audience insights to optimize your marketing spend.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Expert Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get guidance from our marketing experts at every step, from strategy development to campaign execution and optimization.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Got questions? We have answers. Here are some of the most common questions about our pricing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of brands using our platform to run successful influencer marketing campaigns.
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

          <Footer />
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
};

export default PricingPage;
