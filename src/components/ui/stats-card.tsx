import React from 'react';
import { LineChart } from './line-chart';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
  graphData?: number[];
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  color = '#4F46E5',
  graphData,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-semibold">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
      </div>
      {graphData && (
        <div className="mt-2 h-12">
          <LineChart data={graphData} color={color} />
        </div>
      )}
    </div>
  );
}; 