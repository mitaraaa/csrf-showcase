import client from "./client";

class TransactionService {
  async transferUnsafe(
    amount: number,
    recipient: string,
    description?: string
  ): Promise<Transaction> {
    const response = await client.post("/transfer/unsafe", null, {
      params: { amount, recipient, description },
    });

    return response.data;
  }

  async transferNaive(
    amount: number,
    recipient: string,
    description?: string
  ): Promise<Transaction> {
    const token = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    const response = await client.post("/transfer/naive", null, {
      params: { amount, recipient, description, csrf: token },
    });

    return response.data;
  }

  async transferSigned(
    session: string,
    amount: number,
    recipient: string,
    description?: string
  ): Promise<Transaction> {
    const response = await client.post("/transfer/signed", null, {
      params: { amount, recipient, description, session },
    });

    return response.data;
  }
}

const transactionService = new TransactionService();
export default transactionService;
