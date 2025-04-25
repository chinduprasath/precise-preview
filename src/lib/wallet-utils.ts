
import { format, formatDistanceToNow } from "date-fns";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy h:mm a");
};

export const getTimeDifference = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const calculateServiceCharge = (amount: number, chargePercent: number): number => {
  return (amount * chargePercent) / 100;
};

export const getWithdrawalSpeedText = (speed: string): string => {
  switch (speed) {
    case 'immediate':
      return 'Immediate';
    case 'one_day':
      return 'Within 1 day';
    case 'three_days':
      return 'Within 3 days';
    default:
      return speed;
  }
};
