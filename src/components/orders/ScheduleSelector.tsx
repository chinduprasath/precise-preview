
import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: { hour: string; minute: string; period: string };
  setSelectedTime: (time: { hour: string; minute: string; period: string }) => void;
}

export function ScheduleSelector({ 
  selectedDate, 
  setSelectedDate,
  selectedTime,
  setSelectedTime
}: ScheduleSelectorProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="font-medium flex items-center gap-2 text-sm">
          <CalendarIcon className="w-4 h-4 text-primary/80" />
          <span>Select Date</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <div className="font-medium flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary/80" />
          <span>Select Time (IST)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Select
            value={selectedTime.hour}
            onValueChange={(value) => setSelectedTime({ ...selectedTime, hour: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTime.minute}
            onValueChange={(value) => setSelectedTime({ ...selectedTime, minute: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTime.period}
            onValueChange={(value) => setSelectedTime({ ...selectedTime, period: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
