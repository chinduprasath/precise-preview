export type ProfileData = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export type Transaction = {
  id: string;
  amount: number;
  transaction_type: "deposit" | "withdrawal" | "order_payment" | "order_earning" | "refund" | "adjustment";
  description: string;
  created_at: string;
  balance_after: number;
  metadata: any;
  user_id: string;
  wallet_id: string;
  profiles?: ProfileData | null;
};

export type Withdrawal = {
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
  user_id: string;
  profiles?: ProfileData | null;
};
