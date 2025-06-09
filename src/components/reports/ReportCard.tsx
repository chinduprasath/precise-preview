import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Download } from 'lucide-react';
import { Report } from '@/types/report';
import { Button } from '@/components/ui/button';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const handleButtonClick = () => {
    if (report.paymentStatus === 'Pending') {
      alert(`Initiating payment for ${report.reportName}`);
      // In a real application, this would redirect to a payment gateway
    } else {
      alert(`Downloading ${report.reportName}`);
      // In a real application, this would trigger a file download
    }
  };

  return (
    <Card className="border border-gray-200 flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>{report.reportNo}</span>
          <FileSpreadsheet size={24} className="text-green-600" />
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">{report.orderPlacedDate}</p>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-2 text-sm">
        <p><span className="font-medium">Order Name:</span> {report.orderName}</p>
        <p><span className="font-medium">Date Range:</span> {report.fromDate} to {report.toDate}</p>
        <p>
          <span className="font-medium">Payment Status:</span>{" "}
          <span
            className={
              report.paymentStatus === "Pending"
                ? "text-yellow-600"
                : "text-green-600"
            }
          >
            {report.paymentStatus}
          </span>
        </p>
        <p><span className="font-medium">Report Name:</span> {report.reportName}</p>
      </CardContent>
      <CardFooter className="pt-4 flex justify-end">
        {report.reportStatus === 'Request Pending' ? (
          <span className="text-gray-500 text-sm">Request Pending</span>
        ) : (
          <Button 
            onClick={handleButtonClick}
            variant={report.paymentStatus === 'Pending' ? 'default' : 'outline'}
            className={report.paymentStatus === 'Pending' ? 'bg-primary hover:bg-primary-dark text-white' : ''}
          >
            {report.paymentStatus === 'Pending' ? 'Pay & Download' : 'Download'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
