import * as Form from "@radix-ui/react-form";
import {
  Button,
  Card,
  Flex,
  Link as RadixLink,
  TextField,
} from "@radix-ui/themes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import userService from "../api/users";
import useAuth from "../hooks/useAuth";

type Credentials = {
  username: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate({ from: "/login" });

  const { register, handleSubmit } = useForm<Credentials>();
  const { user, setUser } = useAuth();

  const [registering, setRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
      navigate({ to: "/" });
    }
  }, [navigate, user]);

  const onSubmit = async (data: Credentials) => {
    setLoading(true);

    try {
      const user = registering
        ? await userService.register(data.username, data.password)
        : await userService.login(data.username, data.password);

      setUser(user);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" className="h-full overflow-hidden">
      <Card className="w-80 p-6">
        <h1 className="text-xl font-semibold mb-4">
          {registering ? "Register" : "Login"}
        </h1>
        <Form.Root
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field name="username">
            <Form.Control asChild>
              <TextField.Root
                size="2"
                type="text"
                placeholder="Username"
                required
                {...register("username", { required: true })}
              >
                <TextField.Slot>
                  <UserRound size={16} />
                </TextField.Slot>
              </TextField.Root>
            </Form.Control>
          </Form.Field>

          <Form.Field name="password">
            <Form.Control asChild>
              <TextField.Root
                size="2"
                type="password"
                placeholder="Password"
                required
                {...register("password", { required: true })}
              >
                <TextField.Slot>
                  <Lock size={16} />
                </TextField.Slot>
              </TextField.Root>
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <Button variant="solid" className="w-full" loading={loading}>
              {registering ? "Register" : "Login"}
            </Button>
          </Form.Submit>
        </Form.Root>
        <RadixLink
          size="1"
          onClick={() => setRegistering(!registering)}
          className="cursor-pointer"
        >
          {registering ? "Login" : "Create an account"}
        </RadixLink>
      </Card>
    </Flex>
  );
};

export const Route = createFileRoute("/login")({
  component: Login,
});
