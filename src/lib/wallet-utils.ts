
export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateServiceCharge = (amount: number, percentage: number) => {
  return (amount * percentage) / 100;
};

export const calculateNetAmount = (amount: number, serviceCharge: number) => {
  return amount - serviceCharge;
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
    case 'approved':
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'failed':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTimeDifference = (date: string | Date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
};

export const getTransactionColor = (type: string) => {
  switch (type) {
    case 'deposit':
    case 'order_earning':
    case 'refund':
      return 'text-green-600';
    case 'withdrawal':
    case 'order_payment':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'deposit':
    case 'order_earning':
    case 'refund':
      return 'arrow-up';
    case 'withdrawal':
    case 'order_payment':
      return 'arrow-down';
    default:
      return 'clock';
  }
};
