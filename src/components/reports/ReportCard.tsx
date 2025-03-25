
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, Download, Folder } from 'lucide-react';
import { Report } from '@/types/report';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-green-600">
              <FileSpreadsheet size={28} />
            </div>
            <div>
              <h3 className="font-medium">{report.title}</h3>
              <p className="text-sm text-gray-500">Terminé --- {report.fileSize}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Folder size={20} className="text-gray-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Download size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <button className="text-sm text-gray-600">
            Afficher tous les téléchargements
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
