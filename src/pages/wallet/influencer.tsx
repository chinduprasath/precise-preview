
import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Clock, Filter, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, getStatusColor, getTimeDifference } from "@/lib/wallet-utils";
import { toast } from "@/components/ui/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Transaction = {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
  balance_after: number;
  metadata: any;
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
};

const InfluencerWalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawalSpeed, setWithdrawalSpeed] = useState("three_days");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank_transfer");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalCharges, setWithdrawalCharges] = useState({
    immediate: 2,
    one_day: 1.5,
    three_days: 0
  });

  useEffect(() => {
    fetchWalletData();
    fetchWalletSettings();
  }, []);

  const fetchWalletSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setWithdrawalCharges({
          immediate: data.immediate_withdrawal_charge,
          one_day: data.one_day_withdrawal_charge,
          three_days: data.three_day_withdrawal_charge
        });
      }
    } catch (error) {
      console.error('Error fetching wallet settings:', error);
    }
  };

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch wallet data
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (walletError) throw walletError;

        setBalance(walletData?.current_balance || 0);
        setTotalEarned(walletData?.total_earned || 0);
        setTotalWithdrawn(walletData?.total_withdrawn || 0);

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;

        setTransactions(transactionsData || []);

        // Fetch withdrawals
        const { data: withdrawalsData, error: withdrawalsError } = await supabase
          .from('wallet_withdrawals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (withdrawalsError) throw withdrawalsError;

        setWithdrawals(withdrawalsData || []);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateServiceCharge = () => {
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return 0;
    
    let percentage = 0;
    switch (withdrawalSpeed) {
      case 'immediate':
        percentage = withdrawalCharges.immediate;
        break;
      case 'one_day':
        percentage = withdrawalCharges.one_day;
        break;
      case 'three_days':
        percentage = withdrawalCharges.three_days;
        break;
    }
    
    return (amount * percentage) / 100;
  };

  const handleWithdrawFunds = async () => {
    const amount = Number(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalMethod === 'bank_transfer' && (!accountNumber || !ifscCode || !accountName)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all bank account details.",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      // In a real implementation, this would call a Supabase Edge Function
      // that handles the withdrawal request
      const serviceCharge = calculateServiceCharge();
      const paymentDetails = withdrawalMethod === 'bank_transfer' 
        ? {
            account_number: accountNumber,
            ifsc_code: ifscCode,
            account_name: accountName
          }
        : {};

      const { data, error } = await supabase.functions.invoke('request-withdrawal', {
        body: { 
          amount, 
          withdrawal_speed: withdrawalSpeed,
          payment_method: withdrawalMethod,
          payment_details: paymentDetails
        }
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ₹${amount} has been submitted successfully.`,
      });

      setWithdrawAmount("");
      setAccountNumber("");
      setIfscCode("");
      setAccountName("");
      setWithdrawalDialogOpen(false);
      fetchWalletData();
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      toast({
        title: "Withdrawal Failed",
        description: "Failed to process withdrawal request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
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

  const getSpeedText = (speed: string) => {
    switch (speed) {
      case 'immediate':
        return 'Immediate';
      case 'one_day':
        return 'Within 1 day';
      case 'three_days':
        return 'Within 3 days';
      default:
        return speed;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">My Wallet</h1>
            </div>

            {/* Wallet Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(balance)}</p>
                <div className="mt-4">
                  <Button 
                    onClick={() => setWithdrawalDialogOpen(true)}
                    disabled={balance <= 0}
                    className="w-full"
                  >
                    Withdraw Funds
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Earned</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalEarned)}</p>
                <p className="text-sm text-gray-500 mt-4">
                  From orders and services
                </p>
              </Card>

              <Card className="p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Withdrawn</h3>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalWithdrawn)}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Successfully processed withdrawals
                </p>
              </Card>
            </div>

            {/* Withdrawals and Transactions */}
            <div className="bg-white shadow-sm rounded-lg">
              <Tabs defaultValue="withdrawals">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                    <TabsTrigger value="transactions">All Transactions</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  </TabsList>
                  <div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Withdrawals Tab */}
                <TabsContent value="withdrawals" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : withdrawals.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No withdrawal requests found.
                      </div>
                    ) : (
                      withdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="p-4 hover:bg-gray-50">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start md:items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                <ArrowDown className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium">Withdrawal - {getSpeedText(withdrawal.withdrawal_speed)}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(withdrawal.created_at)} • {withdrawal.payment_method}
                                </p>
                                <div className="mt-1">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(withdrawal.status)}`}>
                                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right mt-2 md:mt-0">
                              <p className="font-bold">
                                -{formatCurrency(withdrawal.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Service Charge: {formatCurrency(withdrawal.service_charge)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Net Amount: {formatCurrency(withdrawal.amount_after_charge)}
                              </p>
                              {withdrawal.status === 'pending' && (
                                <p className="text-xs text-amber-600 mt-1">
                                  Expected: {formatDate(withdrawal.expected_arrival)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No transactions found.
                      </div>
                    ) : (
                      transactions.map((transaction) => (
                        <div key={transaction.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                {getTransactionIcon(transaction.transaction_type)}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-xs text-gray-500">
                                  {getTimeDifference(transaction.created_at)} • {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                                {transaction.transaction_type === 'deposit' || 
                                  transaction.transaction_type === 'refund' || 
                                  transaction.transaction_type === 'order_earning' 
                                  ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Balance: {formatCurrency(transaction.balance_after)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Earnings Tab */}
                <TabsContent value="earnings" className="p-0">
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : transactions.filter(t => t.transaction_type === 'order_earning').length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No earnings found.
                      </div>
                    ) : (
                      transactions
                        .filter(t => t.transaction_type === 'order_earning')
                        .map((transaction) => (
                          <div key={transaction.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  <ArrowUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-xs text-gray-500">
                                    {getTimeDifference(transaction.created_at)} • {formatDate(transaction.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  +{formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Balance: {formatCurrency(transaction.balance_after)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Withdrawal Dialog */}
      <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Request a withdrawal from your wallet balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
              />
              {Number(withdrawAmount) > balance && (
                <p className="text-xs text-red-500 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Insufficient balance
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="withdrawal-speed">Withdrawal Speed</Label>
              <Select value={withdrawalSpeed} onValueChange={setWithdrawalSpeed}>
                <SelectTrigger id="withdrawal-speed">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate ({withdrawalCharges.immediate}% fee)</SelectItem>
                  <SelectItem value="one_day">Within 1 day ({withdrawalCharges.one_day}% fee)</SelectItem>
                  <SelectItem value="three_days">Within 3 days (No fee)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="withdrawal-method">Payment Method</Label>
              <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                <SelectTrigger id="withdrawal-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {withdrawalMethod === 'bank_transfer' && (
              <div className="space-y-2">
                <div className="grid gap-1">
                  <Label htmlFor="account-name">Account Holder Name</Label>
                  <Input
                    id="account-name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account name"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ifsc-code">IFSC Code</Label>
                  <Input
                    id="ifsc-code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="Enter IFSC code"
                  />
                </div>
              </div>
            )}
            
            {withdrawalMethod === 'upi' && (
              <div className="grid gap-1">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter UPI ID"
                />
              </div>
            )}
            
            {Number(withdrawAmount) > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span>{formatCurrency(Number(withdrawAmount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Charge ({withdrawalSpeed === 'immediate' ? withdrawalCharges.immediate : 
                                        withdrawalSpeed === 'one_day' ? withdrawalCharges.one_day : 0}%):</span>
                  <span>{formatCurrency(calculateServiceCharge())}</span>
                </div>
                <div className="border-t border-gray-200 mt-1 pt-1 flex justify-between font-medium">
                  <span>You will receive:</span>
                  <span>{formatCurrency(Number(withdrawAmount) - calculateServiceCharge())}</span>
                </div>
              </div>
            )}
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleWithdrawFunds} 
              disabled={isWithdrawing || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > balance}
            >
              Request Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InfluencerWalletPage;
