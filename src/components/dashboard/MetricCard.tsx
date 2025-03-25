
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  valueClassName?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  className = "", 
  valueClassName = ""
}) => {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 font-medium mb-2">{title}</p>
        <p className={`text-3xl font-bold text-primary ${valueClassName}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
