
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentGatewayConfig {
  isEnabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

export const PaymentGatewaySettings = () => {
  const { register, handleSubmit, setValue, watch } = useForm<PaymentGatewayConfig>({
    defaultValues: {
      isEnabled: false,
      apiKey: '',
      secretKey: '',
      webhookSecret: '',
      testMode: false
    }
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('wallet_settings')
        .select('payment_gateway_settings')
        .single();

      if (error) {
        toast.error('Failed to load payment gateway settings');
        return;
      }

      if (data?.payment_gateway_settings) {
        const settings = data.payment_gateway_settings as Record<string, any>;
        setValue('isEnabled', Boolean(settings.isEnabled));
        setValue('apiKey', String(settings.apiKey || ''));
        setValue('secretKey', String(settings.secretKey || ''));
        setValue('webhookSecret', String(settings.webhookSecret || ''));
        setValue('testMode', Boolean(settings.testMode));
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: PaymentGatewayConfig) => {
    setIsLoading(true);
    try {
      // Convert the PaymentGatewayConfig to a plain object that's compatible with Json type
      const paymentSettings: Record<string, any> = {
        isEnabled: data.isEnabled,
        apiKey: data.apiKey,
        secretKey: data.secretKey,
        webhookSecret: data.webhookSecret,
        testMode: data.testMode
      };

      const { error } = await supabase
        .from('wallet_settings')
        .update({
          payment_gateway_settings: paymentSettings,
          last_modified_at: new Date().toISOString(), // Convert Date to ISO string
        })
        .eq('id', '1'); // Convert the number to string for type compatibility

      if (error) throw error;
      toast.success('Payment gateway settings updated successfully');
    } catch (error) {
      toast.error('Failed to update payment gateway settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="isEnabled">Enable Payment Gateway</Label>
            <Switch
              id="isEnabled"
              checked={watch('isEnabled')}
              onCheckedChange={(checked) => setValue('isEnabled', checked)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                {...register('apiKey')}
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                {...register('secretKey')}
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="webhookSecret">Webhook Secret</Label>
              <Input
                id="webhookSecret"
                type="password"
                {...register('webhookSecret')}
                className="font-mono"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="testMode">Test Mode</Label>
              <Switch
                id="testMode"
                checked={watch('testMode')}
                onCheckedChange={(checked) => setValue('testMode', checked)}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
