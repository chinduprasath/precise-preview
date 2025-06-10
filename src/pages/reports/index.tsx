import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/layout/Sidebar';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface ReportCardProps {
  report: ReportRequest;
}

interface ReportRequest {
  id: string;
  reportNo: string;
  orderName: string;
  orderPlacedDate: string;
  dateRange: string;
  paymentStatus: 'Completed' | 'Pending';
  reportFileName: string;
}

const dummyReports: ReportRequest[] = [
  {
    id: '1',
    reportNo: 'REP0001',
    orderName: 'Campaign X',
    orderPlacedDate: '2023-10-02',
    dateRange: '2023-01-01 to 2023-01-31',
    paymentStatus: 'Completed',
    reportFileName: 'REP0001_Campaign X.xlsx',
  },
  {
    id: '2',
    reportNo: 'REP0002',
    orderName: 'Campaign Y',
    orderPlacedDate: '2023-04-27',
    dateRange: '2023-02-01 to 2023-02-28',
    paymentStatus: 'Pending',
    reportFileName: 'REP0002_Campaign Y.xlsx',
  },
  {
    id: '3',
    reportNo: 'REP0003',
    orderName: 'Campaign Z',
    orderPlacedDate: '2023-09-14',
    dateRange: '2023-03-01 to 2023-03-31',
    paymentStatus: 'Completed',
    reportFileName: 'REP0003_Campaign Z.xlsx',
  },
  {
    id: '4',
    reportNo: 'REP0004',
    orderName: 'Campaign A',
    orderPlacedDate: '2024-06-15',
    dateRange: '2024-04-01 to 2024-04-30',
    paymentStatus: 'Pending',
    reportFileName: 'REP0004_Campaign A.xlsx',
  },
  {
    id: '5',
    reportNo: 'REP0005',
    orderName: 'Campaign B',
    orderPlacedDate: '2024-01-20',
    dateRange: '2023-11-01 to 2023-11-30',
    paymentStatus: 'Completed',
    reportFileName: 'REP0005_Campaign B.xlsx',
  },
  {
    id: '6',
    reportNo: 'REP0006',
    orderName: 'Campaign C',
    orderPlacedDate: '2023-12-01',
    dateRange: '2023-12-01 to 2023-12-31',
    paymentStatus: 'Pending',
    reportFileName: 'REP0006_Campaign C.xlsx',
  },
];

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const handleDownload = () => {
    alert(`Downloading ${report.reportFileName}`);
  };

  const handlePayAndDownload = () => {
    alert(`Paying and Downloading ${report.reportFileName}`);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{report.reportNo}</CardTitle>
        <FileText className="h-6 w-6 text-green-500" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-muted-foreground">Order Placed Date:</p>
          <p className="text-right">{report.orderPlacedDate}</p>
          <p className="text-muted-foreground">Order Name:</p>
          <p className="text-right">{report.orderName}</p>
          <p className="text-muted-foreground">Date Range:</p>
          <p className="text-right">{report.dateRange}</p>
          <p className="text-muted-foreground">Payment Status:</p>
          <p className={`text-right ${report.paymentStatus === 'Completed' ? 'text-green-500' : 'text-orange-500'}`}>
            {report.paymentStatus}
          </p>
          <p className="text-muted-foreground">Report Name:</p>
          <p className="text-right">{report.reportFileName}</p>
        </div>
        <div className="mt-4">
          {report.paymentStatus === 'Completed' ? (
            <Button onClick={handleDownload} className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          ) : (
            <Button onClick={handlePayAndDownload} className="w-full">
              Pay & Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ReportsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('name');
  const [filteredReports, setFilteredReports] = useState<ReportRequest[]>(dummyReports);

  // State for the Request Report modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNameForRequest, setOrderNameForRequest] = useState('');
  const [fromDateForRequest, setFromDateForRequest] = useState<Date>();
  const [toDateForRequest, setToDateForRequest] = useState<Date>();

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType]);

  const applyFilters = () => {
    let tempReports = dummyReports;

    if (searchTerm) {
      tempReports = tempReports.filter(report => {
        if (filterType === 'name') {
          return report.orderName.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterType === 'date') {
          return report.dateRange.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 report.orderPlacedDate.includes(searchTerm);
        }
        return true;
      });
    }
    setFilteredReports(tempReports);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRequestReportSubmit = () => {
    // Here you would typically send this data to a backend service
    console.log({
      orderName: orderNameForRequest,
      fromDate: fromDateForRequest ? format(fromDateForRequest, 'yyyy-MM-dd') : null,
      toDate: toDateForRequest ? format(toDateForRequest, 'yyyy-MM-dd') : null,
    });
    alert("Report request submitted!");
    setIsModalOpen(false);
    setOrderNameForRequest('');
    setFromDateForRequest(undefined);
    setToDateForRequest(undefined);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ConditionalHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold">Reports</h1>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[120px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDateForRequest ? format(fromDateForRequest, "PPP") : <span>From Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fromDateForRequest}
                      onSelect={setFromDateForRequest}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[120px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDateForRequest ? format(toDateForRequest, "PPP") : <span>To Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={toDateForRequest}
                      onSelect={setToDateForRequest}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={() => setIsModalOpen(true)}>Request Report</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Custom Report</DialogTitle>
            <DialogDescription>
              Fill in the details below to request a custom report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="orderName">Order Name / No</Label>
              <Input
                id="orderName"
                value={orderNameForRequest}
                onChange={(e) => setOrderNameForRequest(e.target.value)}
                placeholder="e.g., Campaign X, ORD-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "w-full justify-start text-left font-normal"
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDateForRequest ? format(fromDateForRequest, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDateForRequest}
                    onSelect={setFromDateForRequest}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "w-full justify-start text-left font-normal"
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDateForRequest ? format(toDateForRequest, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDateForRequest}
                    onSelect={setToDateForRequest}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestReportSubmit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
