
import React from 'react';
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusColor, getTimeDifference } from "@/lib/wallet-utils";
import type { Withdrawal } from "@/types/wallet";

interface WithdrawalListProps {
  withdrawals: Withdrawal[];
  isLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const WithdrawalList: React.FC<WithdrawalListProps> = ({
  withdrawals,
  isLoading,
  onApprove,
  onReject,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3 text-left">User</th>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Speed</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-right">Amount</th>
            <th className="px-6 py-3 text-right">After Fees</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              </td>
            </tr>
          ) : withdrawals.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                No withdrawal requests found.
              </td>
            </tr>
          ) : (
            withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {withdrawal.profiles && withdrawal.profiles.first_name ? (
                    <div>
                      <p className="font-medium">
                        {withdrawal.profiles.first_name} {withdrawal.profiles.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{withdrawal.profiles.email}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">User not found</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p>{formatDate(withdrawal.created_at)}</p>
                  <p className="text-xs text-gray-500">{getTimeDifference(withdrawal.created_at)}</p>
                </td>
                <td className="px-6 py-4">
                  {withdrawal.withdrawal_speed === 'immediate' ? 'Immediate' : 
                   withdrawal.withdrawal_speed === 'one_day' ? 'Within 1 day' : 
                   'Within 3 days'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-bold text-red-600">
                  -{formatCurrency(withdrawal.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  {formatCurrency(withdrawal.amount_after_charge)}
                  <p className="text-xs text-gray-500">
                    Fee: {formatCurrency(withdrawal.service_charge)}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  {withdrawal.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onApprove(withdrawal.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => onReject(withdrawal.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {withdrawal.status !== 'pending' && (
                    <span className="text-xs text-gray-500">
                      {withdrawal.status === 'approved' ? 'Approved' : 
                       withdrawal.status === 'rejected' ? 'Rejected' : 
                       withdrawal.status === 'completed' ? 'Completed' : 
                       withdrawal.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalList;
