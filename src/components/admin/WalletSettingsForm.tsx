
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WalletSettingsFormData {
  isEnabled: boolean;
  immediateCharge: string;
  oneDayCharge: string;
  threeDayCharge: string;
  minWithdrawal: string;
  maxWithdrawal: string;
}

export const WalletSettingsForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm<WalletSettingsFormData>();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('wallet_settings')
        .select('*')
        .single();

      if (error) {
        toast.error('Failed to load wallet settings');
        return;
      }

      if (data) {
        setValue('isEnabled', data.is_enabled);
        setValue('immediateCharge', data.immediate_withdrawal_charge.toString());
        setValue('oneDayCharge', data.one_day_withdrawal_charge.toString());
        setValue('threeDayCharge', data.three_day_withdrawal_charge.toString());
        setValue('minWithdrawal', data.min_withdrawal_amount.toString());
        setValue('maxWithdrawal', data.max_withdrawal_amount.toString());
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: WalletSettingsFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('wallet_settings')
        .update({
          is_enabled: data.isEnabled,
          immediate_withdrawal_charge: parseFloat(data.immediateCharge),
          one_day_withdrawal_charge: parseFloat(data.oneDayCharge),
          three_day_withdrawal_charge: parseFloat(data.threeDayCharge),
          min_withdrawal_amount: parseFloat(data.minWithdrawal),
          max_withdrawal_amount: parseFloat(data.maxWithdrawal),
          last_modified_at: new Date().toISOString(),
        })
        .eq('id', 1);

      if (error) throw error;
      toast.success('Wallet settings updated successfully');
    } catch (error) {
      toast.error('Failed to update wallet settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="isEnabled">Enable Wallet System</Label>
            <Switch
              id="isEnabled"
              checked={watch('isEnabled')}
              onCheckedChange={(checked) => setValue('isEnabled', checked)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Service Charges</Label>
              <div className="grid gap-4 mt-2">
                <div>
                  <Label>Immediate Withdrawal (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('immediateCharge')}
                  />
                </div>
                <div>
                  <Label>One Day Withdrawal (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('oneDayCharge')}
                  />
                </div>
                <div>
                  <Label>Three Days Withdrawal (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('threeDayCharge')}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Withdrawal Limits</Label>
              <div className="grid gap-4 mt-2">
                <div>
                  <Label>Minimum Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('minWithdrawal')}
                  />
                </div>
                <div>
                  <Label>Maximum Amount (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('maxWithdrawal')}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
