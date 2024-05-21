type User = {
  id: number;

  username: string;
  balance: number;

  transactions_count: number;
  transactions: Transaction[];

  session: string;
};
