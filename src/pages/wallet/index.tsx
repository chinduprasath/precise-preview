
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useWallet } from '@/hooks/useWallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WalletPage = () => {
  const { walletData, isLoading } = useWallet();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Wallet Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{walletData.currentBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{walletData.totalEarned.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Withdrawn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{walletData.totalWithdrawn.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WalletPage;
