import { Callout, Flex } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeEuro, TriangleAlert, Users } from "lucide-react";
import { useCallback, useEffect } from "react";
import userService from "../api/users";
import InfoCard from "../components/InfoCard";
import Navbar from "../components/Navbar";
import TransactionItem from "../components/Transaction";
import Transfer from "../components/Transfer";
import RequireAuth from "../contexts/requireAuth";
import useAuth from "../hooks/useAuth";

const Index = () => {
  const { user, setUser } = useAuth();

  const groupedTransactions = (user?.transactions || []).reduce(
    (acc: { [date: string]: Transaction[] }, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("en-EN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      acc[date].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      return acc;
    },
    {}
  );

  const sortedGroupedTransactions = Object.entries(groupedTransactions).sort(
    ([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    }
  );

  const refreshUser = useCallback(() => {
    return userService.getMe().then(setUser);
  }, [setUser]);

  useEffect(() => {
    const interval = setInterval(refreshUser, 5000);

    return () => clearInterval(interval);
  }, [refreshUser]);

  return (
    <>
      <Navbar />
      <Flex align="center" justify="start" className="px-32">
        <div className="flex flex-col gap-4 w-[600px] items-start justify-start">
          <Callout.Root className="w-full">
            <Callout.Icon>
              <TriangleAlert size={16} strokeWidth={2} />
            </Callout.Icon>
            <Callout.Text>
              This page is vulnerable to CSRF attacks. Click to{" "}
              <a href="#" className="font-semibold hover:underline">
                learn why
              </a>
              .
            </Callout.Text>
          </Callout.Root>
          <h1 className="text-xl font-semibold opacity-90">My bank account</h1>
          <Flex
            align="center"
            justify="start"
            gap="12px"
            wrap="wrap"
            className="w-full"
          >
            <InfoCard
              value={`€ ${user?.balance}`}
              label="Total balance"
              Icon={BadgeEuro}
              size={2}
            />
            <InfoCard
              value={user?.transactions_count.toString() || "0"}
              label="Total transactions"
              Icon={Users}
            />
            <Transfer />
          </Flex>
          <h1 className="text-xl font-semibold opacity-90">
            Recent transactions
          </h1>
          <Flex
            align="center"
            justify="start"
            gap="12px"
            wrap="wrap"
            className="w-full mb-12"
          >
            {user?.transactions && user.transactions.length > 0 ? (
              sortedGroupedTransactions.map(([date, transactions]) => (
                <div className="w-full" key={date}>
                  <h2 className="text-base font-semibold opacity-90 mb-3">
                    {date}
                  </h2>
                  <div className="flex flex-col gap-3" key={date}>
                    {transactions.map((transaction) => (
                      <TransactionItem key={transaction.id} {...transaction} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <span className="opacity-70 w-full text-center">
                Nothing to show.
              </span>
            )}
          </Flex>
        </div>
      </Flex>
    </>
  );
};

export const Route = createFileRoute("/")({
  component: () => (
    <>
      <RequireAuth />
      <Index />
    </>
  ),
});
