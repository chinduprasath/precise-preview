
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  valueClassName?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  className = "", 
  valueClassName = "",
  icon,
  trend
}) => {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <p className={`text-3xl font-bold text-primary ${valueClassName}`}>{value}</p>
        
        {trend && (
          <div className="mt-2 flex items-center">
            <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{trend.value}%</span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
