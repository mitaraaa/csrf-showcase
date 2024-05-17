import client from "./client";

class TransactionService {
  async transfer(
    amount: number,
    recipient: string,
    description?: string
  ): Promise<Transaction> {
    const response = await client.post("/transfer", null, {
      params: { amount, recipient, description },
    });

    return response.data;
  }
}

const transactionService = new TransactionService();
export default transactionService;
