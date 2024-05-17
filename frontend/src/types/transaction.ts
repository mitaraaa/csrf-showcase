type Transaction = {
  id: number;

  sender: string;
  recipient: string;

  amount: number;
  description?: string;

  date: string;
};

type TransactionCreate = {
  amount: number;
  recipient: string;
  description?: string;
};
