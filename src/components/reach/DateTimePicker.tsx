
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date & time',
  className,
}) => {
  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }
    
    const currentValue = value || new Date();
    const hours = currentValue.getHours();
    const minutes = currentValue.getMinutes();

    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    onChange(newDate);
  };

  const handleTimeChange = (timeValue: string) => {
    if (!value) {
      const now = new Date();
      onChange(now);
      return;
    }

    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    onChange(newDate);
  };

  // Generate time options in 30-minute increments
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const formattedDate = value 
    ? format(value, 'dd MMM yyyy HH:mm') 
    : placeholder;

  const selectedTime = value 
    ? `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` 
    : undefined;

  return (
    <div className={cn("space-y-1", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full flex justify-between font-normal border border-input bg-transparent text-sm h-10",
              !value && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 opacity-50" />
              <span className="truncate">{formattedDate}</span>
            </div>
            <span className="text-muted-foreground">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="start">
          <div className="p-3 border-b">
            <CalendarComponent
              mode="single"
              selected={value}
              onSelect={handleDateChange}
              initialFocus
              className={cn("pointer-events-auto")}
            />
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Select
                value={selectedTime}
                onValueChange={handleTimeChange}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="h-48">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateTimePicker;
