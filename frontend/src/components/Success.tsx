import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { Check } from "lucide-react";

const Success = ({ amount, open, setOpen }: SuccessProps) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content maxWidth="300px">
        <Flex
          direction="column"
          gap="2"
          align="center"
          justify="center"
          className="h-[360px]"
        >
          <div
            className="flex justify-center items-center rounded-full p-2"
            style={{ background: "var(--accent-3)" }}
          >
            <Check
              size={48}
              style={{
                color: "var(--accent-11)",
                transform: "translateY(4px)",
              }}
            />
          </div>
          <h1 className="text-2xl font-semibold text-center">Success</h1>
          <p className="text-lg text-center">
            You have successfully transferred €{amount}.
          </p>
          <AlertDialog.Cancel>
            <Button variant="outline" className="mt-4 rounded-full w-full">
              Close
            </Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

interface SuccessProps {
  amount: number;

  open: boolean;
  setOpen: (open: boolean) => void;
}

export default Success;
