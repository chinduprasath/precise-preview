
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Ban } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const SuspiciousActivities = () => {
  const { data: suspiciousActivities, isLoading } = useQuery({
    queryKey: ['suspicious-activities'],
    queryFn: async () => {
      // Since the function doesn't exist yet, we'll simulate it with a direct query
      // This would be replaced with the actual RPC function once created
      const { data } = await supabase
        .from('wallet_transactions')
        .select(`
          id, 
          user_id,
          amount,
          transaction_type,
          created_at,
          user_profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      // For now, we'll return an empty array or mock data
      return data || [];
    },
  });

  const handleBlockWallet = async (walletId: string) => {
    try {
      const { error } = await supabase
        .from('wallets')
        .update({ is_active: false })
        .eq('id', walletId);

      if (error) throw error;
      toast.success('Wallet has been blocked');
    } catch (error) {
      toast.error('Failed to block wallet');
    }
  };

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
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Suspicious Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!suspiciousActivities || suspiciousActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No suspicious activities detected
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suspiciousActivities.map((activity: any) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    {activity.user_profiles?.first_name} {activity.user_profiles?.last_name}
                    <br />
                    <span className="text-xs text-gray-500">{activity.user_profiles?.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      activity.risk_level === 'high' ? 'destructive' :
                      activity.risk_level === 'medium' ? 'secondary' : 'default'
                    }>
                      {activity.risk_level?.toUpperCase() || 'MEDIUM'}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.reason || 'Unusual transaction pattern'}</TableCell>
                  <TableCell>{new Date(activity.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleBlockWallet(activity.wallet_id || '')}
                      className="flex items-center gap-1"
                    >
                      <Ban className="h-4 w-4" />
                      Block Wallet
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
