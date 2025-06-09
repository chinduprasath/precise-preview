import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ReportCard from '@/components/reports/ReportCard';
import { reportData } from '@/data/reports';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search } from 'lucide-react';

const ReportsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for user and business name (replace with actual data fetching)
  const currentUsername = "JohnDoe";
  const currentBusinessName = "Acme Corp";

  // Mock data for orders dropdown
  const mockOrders = [
    { id: 'order1', name: 'Campaign 1 (ORD-001)' },
    { id: 'order2', name: 'Campaign 2 (ORD-002)' },
    { id: 'order3', name: 'Campaign 3 (ORD-003)' },
  ];

  const handleSubmit = () => {
    console.log({
      currentUsername,
      currentBusinessName,
      selectedOrder,
      fromDate: fromDate?.toISOString(),
      toDate: toDate?.toISOString(),
    });
    // Here you would send the report request to your backend
    alert("Report request submitted!");
    setIsModalOpen(false);
    // Reset form fields
    setSelectedOrder(null);
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset form fields
    setSelectedOrder(null);
    setFromDate(undefined);
    setToDate(undefined);
  };

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reportData.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(reportData.length / reportsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Filter reports based on search term
  const filteredReports = reportData.filter((report) => {
    const search = searchTerm.toLowerCase();
    return (
      report.reportNo.toLowerCase().includes(search) ||
      report.orderName.toLowerCase().includes(search) ||
      report.reportName.toLowerCase().includes(search)
    );
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ConditionalHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-4">
                Reports
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </h1>
              <Button onClick={() => setIsModalOpen(true)}>Request Report</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>

            {filteredReports.length > reportsPerPage && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => paginate(i + 1)}
                        isActive={i + 1 === currentPage}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Report</DialogTitle>
            <DialogDescription>
              Fill in the details to request a custom report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input id="username" value={currentUsername} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessName" className="text-right">Business Name</Label>
              <Input id="businessName" value={currentBusinessName} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="order" className="text-right">Order</Label>
              <Select onValueChange={setSelectedOrder} value={selectedOrder || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {mockOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>{order.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="from-date" className="text-right">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      `col-span-3 w-full justify-start text-left font-normal ${
                        !fromDate && "text-muted-foreground"
                      }`
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to-date" className="text-right">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      `col-span-3 w-full justify-start text-left font-normal ${
                        !toDate && "text-muted-foreground"
                      }`
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
