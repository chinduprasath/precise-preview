
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { formatNumber, formatPercentage, getPlatformColor } from './utils/formatUtils';

interface PlatformMetricCardProps {
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube';
  title: string;
  value: number | string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const PlatformMetricCard: React.FC<PlatformMetricCardProps> = ({
  platform,
  title,
  value,
  change,
  className = ''
}) => {
  const getIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={18} />;
      case 'facebook':
        return <Facebook size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      case 'youtube':
        return <Youtube size={18} />;
    }
  };
  
  const platformColor = getPlatformColor(platform);

  return (
    <Card className={`border-border bg-card ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="p-2 rounded-full" style={{ backgroundColor: `${platformColor}20` }}>
            <div style={{ color: platformColor }}>{getIcon()}</div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-foreground">{value}</h2>
          {change && (
            <div className={`flex items-center text-sm ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {formatPercentage(change.value)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformMetricCard;
