
import React from 'react';
import { Button } from "@/components/ui/button";

interface TransactionPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
      <div className="text-sm text-gray-500">
        Showing {Math.min((page - 1) * pageSize + 1, totalCount)} to {Math.min(page * pageSize, totalCount)} of {totalCount} transactions
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(page + 1)}
          disabled={page * pageSize >= totalCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionPagination;

