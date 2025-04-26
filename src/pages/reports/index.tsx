
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ReportCard from '@/components/reports/ReportCard';
import { reportData } from '@/data/reports';

const ReportsPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ConditionalHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Reports</h1>
            <div className="flex flex-col gap-4">
              {reportData.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
