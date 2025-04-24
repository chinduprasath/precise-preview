
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';

export const WalletButton = () => {
  const { walletData, isLoading } = useWallet();
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate('/wallet')}
    >
      <Wallet className="h-5 w-5" />
      {!isLoading && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
          ₹{walletData.currentBalance.toLocaleString()}
        </span>
      )}
    </Button>
  );
};
