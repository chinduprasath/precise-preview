import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Upload, CalendarIcon, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import Sidebar from '@/components/layout/Sidebar';
import ConditionalHeader from '@/components/layout/ConditionalHeader';

interface ReportRequest {
  id: string;
  reportNo: string;
  userName: string;
  businessName: string;
  orderPlacedDate: string;
  orderName: string;
  dateRange: string;
  isAccepted: boolean;
  uploadedFileName: string | null;
}

const dummyAdminReports: ReportRequest[] = [
  {
    id: '1',
    reportNo: 'REP0001',
    userName: 'John Doe',
    businessName: 'Business A',
    orderPlacedDate: '2023-10-26',
    orderName: 'Campaign X',
    dateRange: '2023-01-01 to 2023-01-31',
    isAccepted: false,
    uploadedFileName: null,
  },
  {
    id: '2',
    reportNo: 'REP0002',
    userName: 'Jane Smith',
    businessName: 'Business B',
    orderPlacedDate: '2023-10-27',
    orderName: 'Campaign Y',
    dateRange: '2023-02-01 to 2023-02-28',
    isAccepted: true,
    uploadedFileName: 'report_campaign_y.pdf',
  },
  {
    id: '3',
    reportNo: 'REP0003',
    userName: 'Peter Jones',
    businessName: 'Business C',
    orderPlacedDate: '2023-10-28',
    orderName: 'Campaign Z',
    dateRange: '2023-03-01 to 2023-03-31',
    isAccepted: false,
    uploadedFileName: null,
  },
  {
    id: '4',
    reportNo: 'REP0004',
    userName: 'Alice Brown',
    businessName: 'Business D',
    orderPlacedDate: '2023-10-29',
    orderName: 'Campaign A',
    dateRange: '2023-04-01 to 2024-04-30',
    isAccepted: true,
    uploadedFileName: 'report_campaign_a.pdf',
  },
  {
    id: '5',
    reportNo: 'REP0005',
    userName: 'Bob White',
    businessName: 'Business E',
    orderPlacedDate: '2023-10-30',
    orderName: 'Campaign B',
    dateRange: '2023-05-01 to 2023-05-31',
    isAccepted: false,
    uploadedFileName: null,
  },
  {
    id: '6',
    reportNo: 'REP0006',
    userName: 'Charlie Green',
    businessName: 'Business F',
    orderPlacedDate: '2023-10-31',
    orderName: 'Campaign C',
    dateRange: '2023-06-01 to 2023-06-30',
    isAccepted: true,
    uploadedFileName: 'report_campaign_c.pdf',
  },
];

const ReportCard: React.FC<{ report: ReportRequest; onAccept: (id: string) => void; onUpload: (id: string, fileName: string) => void; } > = ({ report, onAccept, onUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpload(report.id, event.target.files[0].name);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{report.reportNo}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-muted-foreground">User Name:</p>
          <p className="text-right">{report.userName}</p>
          <p className="text-muted-foreground">Business Name:</p>
          <p className="text-right">{report.businessName}</p>
          <p className="text-muted-foreground">Order Placed Date:</p>
          <p className="text-right">{report.orderPlacedDate}</p>
          <p className="text-muted-foreground">Order Name / No:</p>
          <p className="text-right">{report.orderName}</p>
          <p className="text-muted-foreground">Date Range:</p>
          <p className="text-right">{report.dateRange}</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button
            onClick={() => onAccept(report.id)}
            disabled={report.isAccepted}
            variant={report.isAccepted ? "outline" : "default"}
            className="flex-1"
          >
            {report.isAccepted ? 'Accepted' : 'Accept'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            onClick={handleUploadClick}
            disabled={!report.isAccepted}
            variant="outline"
            className="flex-1"
          >
            {report.uploadedFileName ? `Uploaded: ${report.uploadedFileName}` : 'Upload'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportRequest[]>(dummyAdminReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  useEffect(() => {
    applyFilters();
  }, [searchTerm, fromDate, toDate]);

  const applyFilters = () => {
    let tempReports = dummyAdminReports;

    if (searchTerm) {
      tempReports = tempReports.filter(report =>
        report.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.orderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (fromDate && toDate) {
      tempReports = tempReports.filter(report => {
        const reportDate = new Date(report.orderPlacedDate);
        return reportDate >= fromDate && reportDate <= toDate;
      });
    }
    setReports(tempReports);
  };

  const handleAccept = (id: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === id ? { ...report, isAccepted: true } : report
      )
    );
  };

  const handleUpload = (id: string, fileName: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === id ? { ...report, uploadedFileName: fileName } : report
      )
    );
  };

  const handleExport = () => {
    console.log('Exporting reports...', { reports, fromDate, toDate });
    alert('Exporting reports data...');
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
                <h1 className="text-3xl font-bold">Report Requests</h1>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "w-[180px] justify-start text-left font-normal"
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>From Date</span>}
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "w-[180px] justify-start text-left font-normal"
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>To Date</span>}
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
                <Button
                  onClick={handleExport}
                  variant="default"
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onAccept={handleAccept}
                  onUpload={handleUpload}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReportsPage;
