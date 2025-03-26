
import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection = () => {
  return (
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
  );
};

export default TestimonialsSection;
export { TestimonialsSection };
