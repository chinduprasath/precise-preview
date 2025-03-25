
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, ClipboardList, Package, Users } from 'lucide-react';

interface SummaryItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  percentage: string;
  colorClass: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ 
  icon, 
  value, 
  label, 
  percentage, 
  colorClass 
}) => {
  return (
    <div className={`p-4 rounded-lg ${colorClass} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">{value}</p>
          <div className="flex flex-col">
            <span className="text-xs">{label}</span>
            <span className="text-xs">{percentage}</span>
          </div>
        </div>
        <div className="p-2 bg-white/20 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface SalesSummaryCardProps {
  title: string;
}

const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({ title }) => {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-medium mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">Sales Summary</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryItem 
            icon={<ShoppingBag className="h-6 w-6 text-white" />}
            value="$5k"
            label="Total Sales"
            percentage="+10% from yesterday"
            colorClass="bg-indigo-500"
          />
          
          <SummaryItem 
            icon={<ClipboardList className="h-6 w-6 text-white" />}
            value="500"
            label="Total Order"
            percentage="+8% from yesterday"
            colorClass="bg-blue-500"
          />
          
          <SummaryItem 
            icon={<Package className="h-6 w-6 text-white" />}
            value="9"
            label="Product Sold"
            percentage="+2% from yesterday"
            colorClass="bg-violet-500"
          />
          
          <SummaryItem 
            icon={<Users className="h-6 w-6 text-white" />}
            value="12"
            label="New Customer"
            percentage="+2% from yesterday"
            colorClass="bg-indigo-400"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSummaryCard;
