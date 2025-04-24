
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WalletData {
  currentBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency: string;
}

export const useWallet = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [walletData, setWalletData] = useState<WalletData>({
    currentBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    currency: 'INR'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletData();
    
    // Subscribe to realtime wallet updates
    const channel = supabase
      .channel('wallet_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets'
        },
        (payload) => {
          console.log('Wallet update:', payload);
          fetchWalletData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchWalletData = async () => {
    try {
      const { data: walletData, error } = await supabase
        .from('wallets')
        .select('*')
        .single();

      if (error) throw error;

      if (walletData) {
        setWalletData({
          currentBalance: walletData.current_balance,
          totalEarned: walletData.total_earned,
          totalWithdrawn: walletData.total_withdrawn,
          currency: walletData.currency
        });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    walletData,
    refetch: fetchWalletData
  };
};
