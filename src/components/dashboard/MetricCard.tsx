import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  valueClassName?: string;
  children?: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  className = "", 
  valueClassName = "",
  children
}) => {
  return (
    <Card className={`${className} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <div className="rounded-full p-2 bg-white/50 dark:bg-white/10">
            {children}
          </div>
        </div>
        <div className="mt-2">
          <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
