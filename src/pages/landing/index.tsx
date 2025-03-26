
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/components/landing/LandingHeader';
import PricingCard from '@/components/landing/PricingCard';
import TestimonialCard from '@/components/landing/TestimonialCard';
import AboutSection from '@/components/landing/AboutSection';
import ContactForm from '@/components/landing/ContactForm';
import { Input } from '@/components/ui/input';
import { ArrowRight, CheckCircle, Instagram, Facebook, Twitter, Youtube, User, Users, BarChart2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-gradient-to-r from-primary-foreground to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold">Find the Right Influencer for Your Brand</h1>
              <p className="text-xl text-muted-foreground">
                Connect with top influencers across social platforms to amplify your brand's reach and engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/signup')} className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-primary/10 rounded-xl overflow-hidden flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Platform preview" 
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
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
      
      {/* How It Works */}
      <section className="px-4 py-20 bg-card">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-xl border border-border relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-muted-foreground">
                Find influencers based on niche, follower count, and engagement rates
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-border relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Order</h3>
              <p className="text-muted-foreground">
                Place orders directly with influencers based on their pricing
              </p>
            </div>
            <div className="p-6 bg-background rounded-xl border border-border relative">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Results</h3>
              <p className="text-muted-foreground">
                Monitor campaign metrics and ROI in real-time
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
              <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-gray-600">Active Influencers</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
              <h3 className="text-4xl font-bold text-primary mb-2">5M+</h3>
              <p className="text-gray-600">Audience Reach</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
              <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How InfluenceConnect Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to discover, connect, and collaborate with influencers who align with your brand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl p-8 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discover Influencers</h3>
              <p className="text-gray-600">
                Browse thousands of influencers across various niches, demographics, and platforms to find your perfect match.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Collaborate</h3>
              <p className="text-gray-600">
                Send requests directly to influencers, negotiate terms, and manage your campaigns all in one place.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BarChart2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Results</h3>
              <p className="text-gray-600">
                Measure campaign performance with detailed analytics and reporting to optimize your influencer marketing ROI.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from businesses who have transformed their marketing with InfluenceConnect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <TestimonialCard 
              quote="InfluenceConnect helped us find influencers who truly understand our brand. Our sales increased by 45% after our first campaign!"
              author="Sarah Johnson"
              role="Marketing Director, FashionBrand"
              avatarUrl="https://picsum.photos/id/1062/100/100"
            />
            
            <TestimonialCard 
              quote="The platform is incredibly easy to use and the results have been outstanding. We've built relationships with influencers who have become true brand ambassadors."
              author="Michael Chen"
              role="CEO, TechStartup"
              avatarUrl="https://picsum.photos/id/1025/100/100"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transparent Pricing Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees, cancel anytime.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PricingCard 
              title="Basic"
              price="$49"
              period="per month"
              description="Perfect for small businesses just getting started with influencer marketing."
              features={[
                "Access to 1,000+ influencers",
                "5 campaign requests per month",
                "Basic analytics",
                "Email support"
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            
            <PricingCard 
              title="Pro"
              price="$99"
              period="per month"
              description="Ideal for growing businesses ready to scale their influencer marketing."
              features={[
                "Access to 5,000+ influencers",
                "20 campaign requests per month",
                "Advanced analytics",
                "Priority email support",
                "Campaign management tools"
              ]}
              buttonText="Get Started"
              buttonVariant="default"
              highlighted={true}
            />
            
            <PricingCard 
              title="Advanced"
              price="$199"
              period="per month"
              description="For established businesses with serious influencer marketing needs."
              features={[
                "Access to all influencers",
                "Unlimited campaign requests",
                "Comprehensive analytics",
                "24/7 phone support",
                "Dedicated account manager",
                "Custom reporting"
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            
            <PricingCard 
              title="Custom"
              price="Contact Us"
              period=""
              description="Tailored solutions for enterprise clients with specific requirements."
              features={[
                "Custom influencer selection",
                "Bespoke campaign strategies",
                "White-label options",
                "API access",
                "Multi-user accounts",
                "Enterprise-level support"
              ]}
              buttonText="Contact Sales"
              buttonVariant="outline"
            />
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <AboutSection id="about" />
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600 mb-8">
                Have questions about InfluenceConnect? Our team is here to help you find the right solution for your business.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email Us</h3>
                    <a href="mailto:contact@influenceconnect.com" className="text-primary hover:underline">contact@influenceconnect.com</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Visit Us</h3>
                    <p className="text-gray-600">123 Influence Street, Marketing City, 94105</p>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Marketing?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who have already revolutionized their marketing with InfluenceConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">InfluenceConnect</h3>
              <p className="text-muted-foreground mb-4">
                The ultimate platform for influencer marketing management.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a></li>
                <li><a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-muted-foreground mb-4">Subscribe to our newsletter for updates</p>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="bg-background" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 InfluenceConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
