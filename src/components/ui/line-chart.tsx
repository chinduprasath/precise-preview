import React from 'react';

interface LineChartProps {
  data: number[];
  color: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, color }) => {
  const height = 48;
  const width = '100%';
  const padding = 2;
  
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = height - (((value - minValue) / range) * (height - padding * 2) + padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area under the line */}
      <path
        d={`M 0,${height} L ${points} L 100,${height} Z`}
        fill={`url(#gradient-${color})`}
      />
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Data points */}
      {data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = height - (((value - minValue) / range) * (height - padding * 2) + padding);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={color}
          />
        );
      })}
    </svg>
  );
}; 