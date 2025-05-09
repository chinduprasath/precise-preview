
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ServiceOrderFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    status?: string;
    serviceType?: string;
    dateRange?: string;
  }) => void;
}

const ServiceOrderFilters: React.FC<ServiceOrderFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [serviceType, setServiceType] = React.useState('');
  const [dateRange, setDateRange] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, status, serviceType, dateRange });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value, serviceType, dateRange });
  };

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    onFilterChange({ search, status, serviceType: value, dateRange });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onFilterChange({ search, status, serviceType, dateRange: value });
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setServiceType('');
    setDateRange('');
    onFilterChange({});
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          placeholder="Search by order ID or user name..."
          className="pl-10"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={serviceType} onValueChange={handleServiceTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Service Types</SelectItem>
          <SelectItem value="graphics_design">Graphics Design</SelectItem>
          <SelectItem value="digital_marketing">Digital Marketing</SelectItem>
          <SelectItem value="social_media">Social Media Campaigns</SelectItem>
          <SelectItem value="ott_campaigns">OTT Campaigns</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateRange} onValueChange={handleDateRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7days">Last 7 Days</SelectItem>
          <SelectItem value="last30days">Last 30 Days</SelectItem>
          <SelectItem value="thisMonth">This Month</SelectItem>
          <SelectItem value="lastMonth">Last Month</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={handleReset} className="whitespace-nowrap">
        <Filter className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
};

export default ServiceOrderFilters;
