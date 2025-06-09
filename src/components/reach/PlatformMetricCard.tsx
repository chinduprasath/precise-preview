import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Link, Info } from 'lucide-react';
import { formatNumber } from '@/components/influencers/utils/formatUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlatformMetricCardProps {
  platform: string;
  title: string;
  value: string;
  change: {
    value: number;
    isPositive: boolean;
  };
}

const PlatformMetricCard: React.FC<PlatformMetricCardProps> = ({ platform, title, value, change }) => {
  const getIcon = () => {
    if (title === 'Link Clicks') {
      return <Link className="h-4 w-4 text-muted-foreground" />;
    }
    return <Eye className="h-4 w-4 text-muted-foreground" />;
  };

  const getTooltipContent = () => {
    if (title.includes('CPE')) {
      return 'The average cost spent for each user engagement (like, comment, share, etc.)';
    }
    if (title.includes('CPM')) {
      return 'The average cost spent to get 1,000 impressions on the content.';
    }
    return '';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1">
          <CardTitle className="text-base font-bold">{title}</CardTitle>
          {getTooltipContent() && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getTooltipContent()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default PlatformMetricCard;
