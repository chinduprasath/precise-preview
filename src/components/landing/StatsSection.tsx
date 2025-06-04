import React from 'react';
const StatsSection = () => {
  return <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
            <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
            <p className="text-gray-600">Active Influencers</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
            <h3 className="text-4xl font-bold text-primary mb-2">20,000+</h3>
            <p className="text-gray-600">Business Users</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm transition-all hover:shadow-md">
            <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>;
};
export default StatsSection;
export { StatsSection };