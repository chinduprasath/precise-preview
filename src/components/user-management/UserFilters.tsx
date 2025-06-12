import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Calendar as CalendarIcon, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserTag } from './UserTable';
import { DateRange } from 'react-day-picker';

interface UserFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: UserFilters) => void;
  availableTags: UserTag[];
  onExport?: () => void;
}

export interface UserFilters {
  dateRange: DateRange | undefined;
  status: string;
  tags: string[];
}

const UserFilters: React.FC<UserFiltersProps> = ({ onSearch, onFilterChange, availableTags, onExport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    dateRange: undefined,
    status: 'all',
    tags: [],
  });
  
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleStatusChange = (status: string) => {
    const updatedFilters = {
      ...filters,
      status,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleTagToggle = (tagId: string) => {
    const updatedTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];
    
    const updatedFilters = {
      ...filters,
      tags: updatedTags,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    const updatedFilters = {
      ...filters,
      dateRange: range,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      dateRange: undefined,
      status: 'all',
      tags: [],
    });
    setDate(undefined);
    onSearch('');
    onFilterChange({
      dateRange: undefined,
      status: 'all',
      tags: [],
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by username, email, or full name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <Search 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
            onClick={handleSearch}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        <Select
          value={filters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
        
        {(filters.status !== 'all' || filters.tags.length > 0 || date?.from) && (
          <Button variant="ghost" onClick={handleClearFilters} size="sm">
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="inline-block">Filter by Tags:</Label>
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <Badge
              key={tag.id}
              variant={filters.tags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      
      {(filters.status !== 'all' || filters.tags.length > 0 || date?.from) && (
        <div className="flex flex-wrap gap-2">
          <Label className="mr-2">Active Filters:</Label>
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleStatusChange('all')} 
              />
            </Badge>
          )}
          {date?.from && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {format(date.from, "LLL dd, y")} 
              {date.to && ` - ${format(date.to, "LLL dd, y")}`}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleDateChange(undefined)} 
              />
            </Badge>
          )}
          {filters.tags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            return tag ? (
              <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                Tag: {tag.name}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleTagToggle(tagId)} 
                />
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default UserFilters;
