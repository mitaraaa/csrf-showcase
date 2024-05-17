import { Card, Flex } from "@radix-ui/themes";
import { CornerDownRight } from "lucide-react";

const TransactionItem = (transaction: TransactionProps) => {
  const time = new Date(transaction.date).toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Card className="w-full flex flex-row justify-between items-center">
      <Flex direction="column" gap="0">
        <span className="text-sm opacity-70">
          <span className="font-semibold">{transaction.sender}</span> at {time}
        </span>
        <span className="text-base font-semibold flex items-center gap-2">
          <CornerDownRight size={16} strokeWidth={2} color="#21fec0d6" />
          {transaction.recipient}
        </span>
        <span className="text-sm opacity-70">
          {transaction.description || "No description provided."}
        </span>
      </Flex>
      <span className="text-2xl font-semibold">€ {transaction.amount}</span>
    </Card>
  );
};

interface TransactionProps {
  sender: string;
  recipient: string;
  amount: number;
  description?: string;
  date: string;
}

export default TransactionItem;
