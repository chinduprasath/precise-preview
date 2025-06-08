
import React from 'react';

const StatsSection = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Result</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Smarter Matching</h3>
            <p className="text-gray-600">AI-powered recommendations help you find the right influencers fast.</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Coming Soon</span>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">All-in-One Dashboard</h3>
            <p className="text-gray-600">Handle proposals, chats, and payments without switching tools.</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">ROI-Driven Analytics</h3>
            <p className="text-gray-600">Know what's working with detailed campaign performance insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
export { StatsSection };
