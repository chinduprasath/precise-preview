
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
  highlighted?: boolean;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  highlighted = false,
}: PricingCardProps) => {
  return (
    <div className={`rounded-xl ${
      highlighted 
        ? 'bg-primary text-white shadow-xl scale-105 z-10 border-2 border-primary' 
        : 'bg-white border border-gray-200'
    } p-8 flex flex-col h-full transition-all hover:shadow-lg`}>
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-1 ${highlighted ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <div className="flex items-end mb-3">
          <span className={`text-3xl font-bold ${highlighted ? 'text-white' : 'text-gray-900'}`}>{price}</span>
          {period && <span className={`ml-1 ${highlighted ? 'text-white/80' : 'text-gray-500'}`}>{period}</span>}
        </div>
        <p className={`text-sm ${highlighted ? 'text-white/90' : 'text-gray-600'}`}>{description}</p>
      </div>
      
      <div className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${highlighted ? 'text-white' : 'text-primary'}`} />
            <span className={`text-sm ${highlighted ? 'text-white/90' : 'text-gray-600'}`}>{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        variant={highlighted ? 'secondary' : buttonVariant}
        className={`w-full mt-auto ${
          highlighted && buttonVariant === 'outline' 
            ? 'bg-white text-primary hover:bg-white/90 hover:text-primary' 
            : ''
        }`}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PricingCard;
