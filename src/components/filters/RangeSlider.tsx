
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
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (value) => value.toString(),
  className
}) => {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && <label className="text-sm font-medium text-gray-700 block">{label}</label>}
      <Slider
        defaultValue={value}
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={(newValue) => onChange(newValue as [number, number])}
        className="py-4"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
