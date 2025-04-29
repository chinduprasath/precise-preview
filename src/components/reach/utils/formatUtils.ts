
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '#9b87f5';
    case 'facebook':
      return '#1EAEDB';
    case 'twitter':
      return '#33C3F0';
    case 'youtube':
      return '#ea384c';
    default:
      return '#8E9196';
  }
};
