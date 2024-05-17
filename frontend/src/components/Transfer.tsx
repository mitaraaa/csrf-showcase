import * as Form from "@radix-ui/react-form";
import {
  AlertDialog,
  Button,
  Flex,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import { CircleCheck, CircleX, Euro, Text, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import transactionService from "../api/transactions";
import userService from "../api/users";
import useAuth from "../hooks/useAuth";
import Success from "./Success";

type Inputs = {
  amount: number;
  recipient: string;
  description?: string;
};

const Transfer = () => {
  const { user, setUser } = useAuth();

  const { register, handleSubmit, watch } = useForm<Inputs>();

  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const [exists, setExists] = useState(false);
  const [checking, setChecking] = useState(false);

  const [loading, setLoading] = useState(false);

  const watchAmount = watch("amount");
  const watchRecipient = watch("recipient");

  const checkRecipient = useDebouncedCallback(async (username: string) => {
    if (!watchRecipient) {
      return;
    }

    if (user?.username === username) {
      setExists(false);
      return;
    }

    setChecking(true);

    try {
      const data = await userService.checkRecipient(username);
      setExists(data.exists);
    } catch (error) {
      setExists(false);
    }

    setChecking(false);
  }, 500);

  const onSubmit = async (data: Inputs) => {
    setLoading(true);

    const response = await transactionService.transfer(
      data.amount,
      data.recipient,
      data.description
    );

    const user = await userService.getMe();

    setAmount(response.amount);

    setTimeout(() => {
      setUser(user);

      setLoading(false);

      setSuccessOpen(true);
      setOpen(false);
    }, 1000);
  };

  const recipientSlot = () => {
    if (!watchRecipient) {
      return null;
    }

    if (checking) {
      return <Spinner size="1" />;
    }

    return exists ? (
      <CircleCheck size={16} color="#21fec0d6" />
    ) : (
      <CircleX size={16} color="#ff4d4f" />
    );
  };

  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger>
          <Button variant="outline" className="w-full">
            Transfer
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="600px">
          <AlertDialog.Title>Transfer</AlertDialog.Title>
          <Form.Root
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Form.Field name="amount">
              <Form.Label className="text-sm opacity-90">
                <span className="text-red-300 mr-1">*</span>
                Amount
              </Form.Label>
              <Form.Control asChild>
                <TextField.Root
                  size="2"
                  type="number"
                  placeholder="0.05"
                  required
                  {...register("amount", {
                    required: true,
                  })}
                >
                  <TextField.Slot>
                    <Euro size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Form.Control>
              <Form.Message
                className="text-xs opacity-70 text-red-300"
                match="valueMissing"
              >
                Field is required
              </Form.Message>
              <Form.Message className="text-xs opacity-70">
                Minimum amount is €0.05
              </Form.Message>
            </Form.Field>

            <Form.Field name="recipient">
              <Form.Label className="text-sm opacity-90">
                <span className="text-red-300 mr-1">*</span>
                Recipient
              </Form.Label>
              <Form.Control asChild>
                <TextField.Root
                  size="2"
                  type="text"
                  placeholder="Recipient's name"
                  required
                  onInput={(event) => checkRecipient(event.currentTarget.value)}
                  {...register("recipient", { required: true })}
                >
                  <TextField.Slot>
                    <UserRound size={16} />
                  </TextField.Slot>
                  <TextField.Slot>{recipientSlot()}</TextField.Slot>
                </TextField.Root>
              </Form.Control>
              <Form.Message
                className="text-xs opacity-70 text-red-300"
                match="valueMissing"
              >
                Field is required
              </Form.Message>

              <Form.Message
                className="text-xs opacity-70 text-red-300 transition-all block mt-1"
                style={{
                  opacity: watchRecipient && !exists ? 1 : 0,
                  height: watchRecipient && !exists ? "auto" : 0,
                }}
              >
                Recipient not found
              </Form.Message>
            </Form.Field>

            <Form.Field name="description">
              <Form.Label className="text-sm opacity-90">
                Description
              </Form.Label>
              <Form.Control asChild>
                <TextField.Root
                  size="2"
                  type="text"
                  placeholder="Description"
                  {...register("description")}
                >
                  <TextField.Slot>
                    <Text size={16} />
                  </TextField.Slot>
                </TextField.Root>
              </Form.Control>
            </Form.Field>

            <Flex gap="2" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <Form.Submit asChild>
                <Button
                  variant="solid"
                  disabled={
                    checking || !exists || !watchAmount || watchAmount <= 0
                  }
                  loading={loading}
                >
                  Transfer
                </Button>
              </Form.Submit>
            </Flex>
          </Form.Root>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <Success amount={amount} open={successOpen} setOpen={setSuccessOpen} />
    </>
  );
};

export default Transfer;
