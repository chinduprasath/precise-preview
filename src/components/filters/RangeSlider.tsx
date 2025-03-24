
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
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (value) => value.toString(),
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formatValue(value[0])}</span>
          <span>-</span>
          <span>{formatValue(value[1])}</span>
        </div>
      </div>
      <Slider
        defaultValue={value}
        max={max}
        min={min}
        step={step}
        onValueChange={(newValue) => onChange(newValue as [number, number])}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
