
import React from 'react';
import { formatCurrency, formatDate, getStatusColor, getTimeDifference } from '@/lib/wallet-utils';
import { ArrowDown, ArrowUp, Clock } from 'lucide-react';

type Transaction = {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
  balance_after: number;
  metadata: any;
  user_id: string;
  wallet_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null;
};

interface WalletTransactionLogsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const WalletTransactionLogs = ({ transactions, isLoading }: WalletTransactionLogsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No transactions found
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'order_earning':
      case 'refund':
        return <ArrowUp className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
      case 'order_payment':
        return <ArrowDown className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'order_earning':
      case 'refund':
        return 'text-green-600';
      case 'withdrawal':
      case 'order_payment':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-3 text-left">Transaction</th>
            <th className="px-6 py-3 text-left">User</th>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-right">Amount</th>
            <th className="px-6 py-3 text-right">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <p className="font-medium">{transaction.description}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                {transaction.profiles ? (
                  <div>
                    <p className="font-medium">
                      {transaction.profiles.first_name} {transaction.profiles.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.profiles.email}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">User not found</p>
                )}
              </td>
              <td className="px-6 py-4">
                {formatDate(transaction.created_at)}
              </td>
              <td className={`px-6 py-4 text-right font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                {transaction.transaction_type === 'deposit' || 
                  transaction.transaction_type === 'refund' || 
                  transaction.transaction_type === 'order_earning' 
                  ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </td>
              <td className="px-6 py-4 text-right">
                {formatCurrency(transaction.balance_after)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTransactionLogs;
