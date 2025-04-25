
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type TransactionType = 'deposit' | 'withdrawal' | 'order_payment' | 'order_earning' | 'refund' | 'adjustment';

interface Profile {
  first_name: string;
  last_name: string;
  email: string;
}

interface Transaction {
  id: string;
  created_at: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  balance_after: number;
  transaction_type: TransactionType;
  reference_id: string | null;
  description: string;
  metadata: Record<string, any>;
  profiles: Profile | null;
}

export const WalletTransactionLogs = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          profiles:user_profiles(
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Handle the response data with proper type casting
      return (data as any[]).map(transaction => ({
        ...transaction,
        profiles: transaction.profiles as Profile | null
      })) as Transaction[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Balance After</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.created_at), 'PPp')}
                </TableCell>
                <TableCell>
                  {transaction.profiles ? (
                    <>
                      {transaction.profiles.first_name} {transaction.profiles.last_name}
                      <br />
                      <span className="text-xs text-gray-500">{transaction.profiles.email}</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">User not found</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={getTransactionBadgeVariant(transaction.transaction_type)}>
                    {formatTransactionType(transaction.transaction_type)}
                  </Badge>
                </TableCell>
                <TableCell className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ₹{Math.abs(transaction.amount).toLocaleString()}
                </TableCell>
                <TableCell>₹{transaction.balance_after.toLocaleString()}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const getTransactionBadgeVariant = (type: TransactionType) => {
  switch (type) {
    case 'deposit':
      return 'default';
    case 'withdrawal':
      return 'secondary';
    case 'order_payment':
      return 'destructive';
    case 'order_earning':
      return 'default';
    case 'refund':
      return 'secondary';
    case 'adjustment':
      return 'outline';
    default:
      return 'outline';
  }
};

const formatTransactionType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};
