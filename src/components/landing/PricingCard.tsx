
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  highlighted?: boolean;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = 'default',
  highlighted = false,
}: PricingCardProps) => {
  return (
    <Card className={`h-full flex flex-col ${highlighted ? 'border-primary shadow-lg scale-105' : ''}`}>
      <CardHeader className="pb-8">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{title}</h3>
          <div className="flex items-baseline text-3xl font-bold">
            {price}
            {period && <span className="ml-1 text-base font-normal text-muted-foreground">{period}</span>}
          </div>
        </div>
        <p className="text-sm text-muted-foreground pt-2">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
export { PricingCard }; // Add named export
