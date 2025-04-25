
import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import WalletTransactionLogs from "@/components/admin/WalletTransactionLogs";
import Layout from "@/components/layout/Layout";
import TransactionFilters from "@/components/admin/wallet/TransactionFilters";
import TransactionPagination from "@/components/admin/wallet/TransactionPagination";
import WithdrawalList from "@/components/admin/wallet/WithdrawalList";
import type { Transaction, Withdrawal, ProfileData } from "@/types/wallet";

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
        .select(`
          *,
          profiles:user_id(
            first_name,
            last_name,
            email,
            role
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (transactionType !== "all") {
        query = query.eq('transaction_type', transactionType as "deposit" | "withdrawal" | "order_payment" | "order_earning" | "refund" | "adjustment");
      }

      if (searchQuery) {
        query = query.textSearch('description', searchQuery);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      if (data) {
        const processedData: Transaction[] = data.map(transaction => {
          let profileData: ProfileData | null = null;
          
          if (transaction.profiles && 
              typeof transaction.profiles === 'object' && 
              transaction.profiles !== null &&
              !('error' in transaction.profiles)) {
            
            const profiles = transaction.profiles as Record<string, unknown>;
            if (profiles && 
                'first_name' in profiles && 
                'last_name' in profiles && 
                'email' in profiles && 
                'role' in profiles) {
              profileData = {
                first_name: profiles.first_name as string,
                last_name: profiles.last_name as string,
                email: profiles.email as string,
                role: profiles.role as string
              };
            }
          }

          return {
            ...transaction,
            profiles: profileData
          } as Transaction;
        });

        let filteredData = processedData;
        if (userRole !== "all") {
          filteredData = processedData.filter(t => 
            t.profiles && t.profiles.role === userRole
          );
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
        .select(`
          *,
          profiles:user_id(
            first_name,
            last_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (userRole !== "all" && userRole === "influencer") {
        query = query.eq('profiles.role', 'influencer');
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const processedData: Withdrawal[] = data.map(withdrawal => {
          let profileData: ProfileData | null = null;
          
          if (withdrawal.profiles && 
              typeof withdrawal.profiles === 'object' && 
              withdrawal.profiles !== null &&
              !('error' in withdrawal.profiles)) {
            
            const profiles = withdrawal.profiles as Record<string, unknown>;
            if (profiles && 
                'first_name' in profiles && 
                'last_name' in profiles && 
                'email' in profiles && 
                'role' in profiles) {
              profileData = {
                first_name: profiles.first_name as string,
                last_name: profiles.last_name as string,
                email: profiles.email as string,
                role: profiles.role as string
              };
            }
          }
          
          return {
            ...withdrawal,
            profiles: profileData
          } as Withdrawal;
        });
        
        setWithdrawals(processedData);
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

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const csvContent = [
      ["ID", "Date", "User", "Role", "Type", "Description", "Amount", "Balance After"].join(","),
      ...transactions.map(t => [
        t.id,
        new Date(t.created_at).toISOString(),
        t.profiles && t.profiles.first_name ? `${t.profiles.first_name} ${t.profiles.last_name}` : 'Unknown',
        t.profiles?.role || 'Unknown',
        t.transaction_type,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount,
        t.balance_after
      ]).join(",")
    ].join("\n");

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
    <Layout>
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
            <Card className="p-4 mb-6">
              <TransactionFilters
                searchQuery={searchQuery}
                transactionType={transactionType}
                userRole={userRole}
                onSearchChange={setSearchQuery}
                onTransactionTypeChange={setTransactionType}
                onUserRoleChange={setUserRole}
              />
            </Card>

            <Card className="overflow-hidden">
              <WalletTransactionLogs 
                transactions={transactions} 
                isLoading={isLoading} 
              />

              <TransactionPagination 
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
              />
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card className="overflow-hidden">
              <WithdrawalList 
                withdrawals={withdrawals}
                isLoading={isLoading}
                onApprove={approveWithdrawal}
                onReject={rejectWithdrawal}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminWalletTransactionsPage;
