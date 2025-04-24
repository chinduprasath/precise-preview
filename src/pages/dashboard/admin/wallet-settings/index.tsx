
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletSettingsForm } from '@/components/admin/WalletSettingsForm';
import { WalletTransactionLogs } from '@/components/admin/WalletTransactionLogs';
import { SuspiciousActivities } from '@/components/admin/SuspiciousActivities';
import { PaymentGatewaySettings } from '@/components/admin/PaymentGatewaySettings';

const WalletSettingsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Wallet Settings</h1>
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Logs</TabsTrigger>
            <TabsTrigger value="suspicious">Suspicious Activities</TabsTrigger>
            <TabsTrigger value="payment-gateways">Payment Gateways</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <WalletSettingsForm />
          </TabsContent>

          <TabsContent value="transactions">
            <WalletTransactionLogs />
          </TabsContent>

          <TabsContent value="suspicious">
            <SuspiciousActivities />
          </TabsContent>

          <TabsContent value="payment-gateways">
            <PaymentGatewaySettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WalletSettingsPage;
