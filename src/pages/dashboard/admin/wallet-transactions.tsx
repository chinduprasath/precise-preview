
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Search, Filter, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, getTimeDifference } from "@/lib/wallet-utils";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

type Withdrawal = {
  id: string;
  amount: number;
  service_charge: number;
  amount_after_charge: number;
  withdrawal_speed: string;
  expected_arrival: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_details: any;
  user_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  } | null;
};

const AdminWalletTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionType, setTransactionType] = useState<string>("all");
  const [userRole, setUserRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchTransactions();
    fetchWithdrawals();
  }, [page, transactionType, userRole, searchQuery]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('wallet_transactions')
        .select('*, profiles:user_id(*)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (transactionType !== "all") {
        query = query.eq('transaction_type', transactionType);
      }

      // Search implementation
      if (searchQuery) {
        query = query.textSearch('description', searchQuery);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      if (data) {
        // Filter by user role if needed
        let filteredData = data;
        if (userRole !== "all") {
          filteredData = data.filter(t => t.profiles?.role === userRole);
        }

        setTransactions(filteredData);
        setTotalCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      let query = supabase
        .from('wallet_withdrawals')
        .select('*, profiles:user_id(*)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (userRole !== "all" && userRole === "influencer") {
        // Only fetch withdrawals for influencers if filtering by role
        query = query.eq('profiles.role', 'influencer');
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setWithdrawals(data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    }
  };

  const approveWithdrawal = async (withdrawalId: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-withdrawal', {
        body: { withdrawalId, action: 'approve' }
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Approved",
        description: "The withdrawal has been approved and is being processed.",
      });

      fetchWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to approve withdrawal.",
        variant: "destructive",
      });
    }
  };

  const rejectWithdrawal = async (withdrawalId: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-withdrawal', {
        body: { withdrawalId, action: 'reject' }
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Rejected",
        description: "The withdrawal has been rejected and funds returned to the user's wallet.",
      });

      fetchWithdrawals();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to reject withdrawal.",
        variant: "destructive",
      });
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'approved':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    // Format transactions for CSV
    const csvContent = [
      // CSV Header
      ["ID", "Date", "User", "Role", "Type", "Description", "Amount", "Balance After"].join(","),
      // CSV Data
      ...transactions.map(t => [
        t.id,
        new Date(t.created_at).toISOString(),
        t.profiles ? `${t.profiles.first_name} ${t.profiles.last_name}` : 'Unknown',
        t.profiles?.role || 'Unknown',
        t.transaction_type,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
        t.amount,
        t.balance_after
      ].join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Wallet Transactions</h1>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Tabs defaultValue="transactions">
              <TabsList className="mb-6">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions">
                {/* Filters */}
                <Card className="p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search transactions..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={transactionType} onValueChange={setTransactionType}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Transaction Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="deposit">Deposits</SelectItem>
                          <SelectItem value="withdrawal">Withdrawals</SelectItem>
                          <SelectItem value="order_payment">Order Payments</SelectItem>
                          <SelectItem value="order_earning">Order Earnings</SelectItem>
                          <SelectItem value="refund">Refunds</SelectItem>
                          <SelectItem value="adjustment">Adjustments</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={userRole} onValueChange={setUserRole}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="User Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="business">Business Users</SelectItem>
                          <SelectItem value="influencer">Influencers</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Transactions Table */}
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-3 text-left">Transaction</th>
                          <th className="px-6 py-3 text-left">User</th>
                          <th className="px-6 py-3 text-left">Type</th>
                          <th className="px-6 py-3 text-left">Date</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                              </div>
                            </td>
                          </tr>
                        ) : transactions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              No transactions found.
                            </td>
                          </tr>
                        ) : (
                          transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                    {getTransactionIcon(transaction.transaction_type)}
                                  </div>
                                  <div className="max-w-xs">
                                    <p className="font-medium truncate" title={transaction.description}>
                                      {transaction.description}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      ID: {transaction.id.slice(0, 8)}...
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {transaction.profiles ? (
                                  <div>
                                    <p className="font-medium">
                                      {transaction.profiles.first_name} {transaction.profiles.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">{transaction.profiles.email}</p>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                      {transaction.profiles.role}
                                    </span>
                                  </div>
                                ) : (
                                  <p className="text-gray-500">User not found</p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                                  {transaction.transaction_type.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <p>{formatDate(transaction.created_at)}</p>
                                <p className="text-xs text-gray-500">{getTimeDifference(transaction.created_at)}</p>
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
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                    <div className="text-sm text-gray-500">
                      Showing {Math.min((page - 1) * pageSize + 1, totalCount)} to {Math.min(page * pageSize, totalCount)} of {totalCount} transactions
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(page + 1)}
                        disabled={page * pageSize >= totalCount}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="withdrawals">
                {/* Withdrawal Requests */}
                <Card className="overflow-hidden">
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
                                {withdrawal.profiles ? (
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
                                      onClick={() => approveWithdrawal(withdrawal.id)}
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => rejectWithdrawal(withdrawal.id)}
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
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminWalletTransactionsPage;
