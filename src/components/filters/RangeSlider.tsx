
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  direction?: 'ltr' | 'rtl';
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (value) => value.toString(),
  className,
  direction = 'ltr'
}) => {
  // Function to transform values for rtl direction
  const transformValue = (inputValue: [number, number]): [number, number] => {
    if (direction === 'rtl') {
      // For RTL, we invert the values within the range
      return [
        max - (inputValue[1] - min),
        max - (inputValue[0] - min)
      ];
    }
    return inputValue;
  };

  // Function to handle value change from the slider
  const handleValueChange = (newValue: [number, number]) => {
    if (direction === 'rtl') {
      // For RTL, we need to invert the values back
      onChange([
        max - (newValue[1] - min),
        max - (newValue[0] - min)
      ]);
    } else {
      onChange(newValue);
    }
  };

  // Transform the current value for display
  const displayValue = direction === 'rtl' 
    ? [max - (value[1] - min), max - (value[0] - min)]
    : value;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && <label className="text-sm font-medium text-gray-700 block">{label}</label>}
      <div className={direction === 'rtl' ? 'transform scale-x-[-1]' : ''}>
        <Slider
          defaultValue={displayValue}
          value={displayValue}
          max={max}
          min={min}
          step={step}
          onValueChange={(newValue) => handleValueChange(newValue as [number, number])}
          className="py-4"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
