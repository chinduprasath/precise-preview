
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define the wallet settings type with the correct structure
interface WalletSettings {
  is_enabled: boolean;
  immediate_withdrawal_charge: number;
  one_day_withdrawal_charge: number;
  three_day_withdrawal_charge: number;
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
  payment_gateway_settings: {
    razorpay: {
      key_id: string;
      enabled: boolean;
    };
    stripe: {
      publishable_key: string;
      enabled: boolean;
    };
  };
  id?: string;
}

const AdminWalletSettingsPage = () => {
  const [settings, setSettings] = useState<WalletSettings>({
    is_enabled: true,
    immediate_withdrawal_charge: 2.0,
    one_day_withdrawal_charge: 1.5,
    three_day_withdrawal_charge: 0.0,
    min_withdrawal_amount: 100.0,
    max_withdrawal_amount: 50000.0,
    payment_gateway_settings: {
      razorpay: {
        key_id: '',
        enabled: false
      },
      stripe: {
        publishable_key: '',
        enabled: false
      }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWalletSettings();
  }, []);

  const fetchWalletSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        // Transform the data to match our expected type
        const transformedSettings: WalletSettings = {
          is_enabled: data.is_enabled,
          immediate_withdrawal_charge: data.immediate_withdrawal_charge,
          one_day_withdrawal_charge: data.one_day_withdrawal_charge,
          three_day_withdrawal_charge: data.three_day_withdrawal_charge,
          min_withdrawal_amount: data.min_withdrawal_amount,
          max_withdrawal_amount: data.max_withdrawal_amount,
          payment_gateway_settings: typeof data.payment_gateway_settings === 'string' 
            ? JSON.parse(data.payment_gateway_settings)
            : data.payment_gateway_settings || {
                razorpay: { key_id: '', enabled: false },
                stripe: { publishable_key: '', enabled: false }
              },
          id: data.id
        };
        
        setSettings(transformedSettings);
      }
    } catch (error) {
      console.error('Error fetching wallet settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('wallet_settings')
        .update({
          is_enabled: settings.is_enabled,
          immediate_withdrawal_charge: settings.immediate_withdrawal_charge,
          one_day_withdrawal_charge: settings.one_day_withdrawal_charge,
          three_day_withdrawal_charge: settings.three_day_withdrawal_charge,
          min_withdrawal_amount: settings.min_withdrawal_amount,
          max_withdrawal_amount: settings.max_withdrawal_amount,
          payment_gateway_settings: settings.payment_gateway_settings
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Wallet settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving wallet settings:', error);
      toast({
        title: "Error",
        description: "Failed to save wallet settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof WalletSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentGatewayChange = (gateway: 'razorpay' | 'stripe', field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      payment_gateway_settings: {
        ...prev.payment_gateway_settings,
        [gateway]: {
          ...prev.payment_gateway_settings[gateway],
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Wallet Settings</h1>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                Save Changes
              </Button>
            </div>

            <Tabs defaultValue="general">
              <TabsList className="mb-8">
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="withdrawal">Withdrawal Fees</TabsTrigger>
                <TabsTrigger value="payment">Payment Gateways</TabsTrigger>
              </TabsList>

              {/* General Settings Tab */}
              <TabsContent value="general">
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Enable Wallet Feature</h3>
                        <p className="text-sm text-gray-500">Toggle to enable or disable wallet functionality globally</p>
                      </div>
                      <Switch 
                        checked={settings.is_enabled}
                        onCheckedChange={(checked) => handleChange('is_enabled', checked)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="min_withdrawal">Minimum Withdrawal Amount (₹)</Label>
                        <Input 
                          id="min_withdrawal"
                          type="number"
                          min="0"
                          value={settings.min_withdrawal_amount}
                          onChange={(e) => handleChange('min_withdrawal_amount', Number(e.target.value))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="max_withdrawal">Maximum Withdrawal Amount (₹)</Label>
                        <Input 
                          id="max_withdrawal"
                          type="number"
                          min="0"
                          value={settings.max_withdrawal_amount}
                          onChange={(e) => handleChange('max_withdrawal_amount', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Withdrawal Fees Tab */}
              <TabsContent value="withdrawal">
                <Card className="p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Withdrawal Service Charges</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="immediate_fee">Immediate Withdrawal Fee (%)</Label>
                      <Input 
                        id="immediate_fee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.immediate_withdrawal_charge}
                        onChange={(e) => handleChange('immediate_withdrawal_charge', Number(e.target.value))}
                      />
                      <p className="text-sm text-gray-500 mt-1">Fee for immediate withdrawals</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="one_day_fee">One Day Withdrawal Fee (%)</Label>
                      <Input 
                        id="one_day_fee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.one_day_withdrawal_charge}
                        onChange={(e) => handleChange('one_day_withdrawal_charge', Number(e.target.value))}
                      />
                      <p className="text-sm text-gray-500 mt-1">Fee for withdrawals processed within 1 day</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="three_day_fee">Three Day Withdrawal Fee (%)</Label>
                      <Input 
                        id="three_day_fee"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.three_day_withdrawal_charge}
                        onChange={(e) => handleChange('three_day_withdrawal_charge', Number(e.target.value))}
                      />
                      <p className="text-sm text-gray-500 mt-1">Fee for withdrawals processed within 3 days</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Payment Gateways Tab */}
              <TabsContent value="payment">
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Razorpay Integration</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Enable Razorpay</h3>
                        <p className="text-sm text-gray-500">Toggle to enable or disable Razorpay integration</p>
                      </div>
                      <Switch 
                        checked={settings.payment_gateway_settings?.razorpay?.enabled || false}
                        onCheckedChange={(checked) => handlePaymentGatewayChange('razorpay', 'enabled', checked)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="razorpay_key">Razorpay Key ID</Label>
                      <Input 
                        id="razorpay_key"
                        value={settings.payment_gateway_settings?.razorpay?.key_id || ''}
                        onChange={(e) => handlePaymentGatewayChange('razorpay', 'key_id', e.target.value)}
                        disabled={!settings.payment_gateway_settings?.razorpay?.enabled}
                      />
                    </div>
                    
                    <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
                      <p>Note: Make sure to configure Razorpay secret key in your Supabase Edge Functions secrets.</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Stripe Integration</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Enable Stripe</h3>
                        <p className="text-sm text-gray-500">Toggle to enable or disable Stripe integration</p>
                      </div>
                      <Switch 
                        checked={settings.payment_gateway_settings?.stripe?.enabled || false}
                        onCheckedChange={(checked) => handlePaymentGatewayChange('stripe', 'enabled', checked)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stripe_key">Stripe Publishable Key</Label>
                      <Input 
                        id="stripe_key"
                        value={settings.payment_gateway_settings?.stripe?.publishable_key || ''}
                        onChange={(e) => handlePaymentGatewayChange('stripe', 'publishable_key', e.target.value)}
                        disabled={!settings.payment_gateway_settings?.stripe?.enabled}
                      />
                    </div>
                    
                    <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-md">
                      <p>Note: Make sure to configure Stripe secret key in your Supabase Edge Functions secrets.</p>
                    </div>
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

export default AdminWalletSettingsPage;
