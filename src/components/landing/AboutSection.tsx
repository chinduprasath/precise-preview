
import React from 'react';
import { TrendingUp, Users, Shield, Clock } from 'lucide-react';

interface AboutSectionProps {
  id?: string;
}

const AboutSection = ({ id }: AboutSectionProps) => {
  return (
    <section id={id} className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About InfluenceConnect</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to revolutionize influencer marketing by making it accessible, 
            transparent, and effective for businesses of all sizes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
            <p className="text-gray-600 mb-4">
              InfluenceConnect was born out of frustration with the traditional influencer marketing landscape. 
              Our founders, having worked with brands of all sizes, saw a need for a platform that removed the 
              barriers to effective influencer partnerships.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a simple matchmaking service has evolved into a comprehensive platform that handles 
              every aspect of the influencer marketing process, from discovery to reporting.
            </p>
            <p className="text-gray-600">
              Today, we're proud to serve thousands of businesses and connect them with our community of vetted 
              influencers who are passionate about creating authentic content that drives results.
            </p>
          </div>
          <div>
            <img 
              src="https://picsum.photos/id/1045/800/600" 
              alt="Team collaboration" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
            <p className="text-gray-600">
              Our platform has generated over $100M in revenue for our clients through strategic influencer partnerships.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
            <p className="text-gray-600">
              Our team of marketing professionals provides guidance and support at every step of your campaign.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Trusted Platform</h3>
            <p className="text-gray-600">
              We vet all influencers on our platform to ensure quality, engagement, and authenticity.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Time Efficient</h3>
            <p className="text-gray-600">
              Our streamlined process saves you time, allowing you to focus on your core business while we handle the details.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-10 shadow-sm">
          <h3 className="text-2xl font-semibold mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-4">1</div>
              <h4 className="text-lg font-medium mb-2">Sign Up & Define Your Needs</h4>
              <p className="text-gray-600">
                Create an account, select your industry, and define your campaign goals and requirements.
              </p>
              <div className="hidden md:block absolute top-6 right-0 w-1/2 h-1 bg-primary/30"></div>
            </div>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-4">2</div>
              <h4 className="text-lg font-medium mb-2">Browse & Connect With Influencers</h4>
              <p className="text-gray-600">
                Search our database of influencers, filter by niche, audience demographics, and platform.
              </p>
              <div className="hidden md:block absolute top-6 right-0 w-1/2 h-1 bg-primary/30"></div>
            </div>
            
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mb-4">3</div>
              <h4 className="text-lg font-medium mb-2">Manage Campaigns & Track Results</h4>
              <p className="text-gray-600">
                Approve content, monitor campaign progress, and measure performance with our analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
