
import React from 'react';
import { Users, CheckCircle, BarChart2 } from 'lucide-react';

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
export { FeaturesSection };
