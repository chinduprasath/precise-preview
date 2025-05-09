
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
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
          </div>
          <div className="rounded-full p-2 bg-white/50 dark:bg-white/10">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
