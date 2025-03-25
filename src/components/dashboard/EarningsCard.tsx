
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EarningsCardProps {
  amount: string;
  percentChange: number;
  period: string;
}

const EarningsCard: React.FC<EarningsCardProps> = ({
  amount,
  percentChange,
  period
}) => {
  // Calculate the percentage for the gauge
  const percentage = Math.min(Math.max(percentChange, 0), 100);
  const rotation = (percentage / 100) * 180;

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium">Earnings</h2>
        <p className="text-sm text-gray-500">Total Expense</p>
        
        <div className="text-2xl font-bold mt-2 text-indigo-700">{amount}</div>
        
        <p className="text-sm mt-1">
          Profit is <span className="font-medium">{percentChange}% More</span> than {period}
        </p>
        
        <div className="relative mt-6 flex justify-center items-center">
          {/* Gauge background */}
          <div className="w-40 h-20 overflow-hidden">
            <div className="w-40 h-40 border-[20px] border-gray-200 rounded-full"></div>
          </div>
          
          {/* Gauge progress */}
          <div 
            className="absolute top-0 w-40 h-20 overflow-hidden"
            style={{ transform: `rotate(${-90 + rotation}deg)`, transformOrigin: 'center bottom' }}
          >
            <div className="w-40 h-40 border-[20px] border-indigo-600 rounded-full"></div>
          </div>
          
          {/* Percentage text */}
          <div className="absolute bottom-0 text-2xl font-bold">
            {percentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsCard;
