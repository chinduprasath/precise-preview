
/**
 * Formats a number to a more readable format with K or M suffix
 * @param num The number to format
 * @returns Formatted string representation of the number
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};
