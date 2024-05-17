import { Outlet, createRootRoute } from "@tanstack/react-router";

const Wrapper = () => {
  return (
    <main className="flex flex-col h-[100vh] items-center px-8">
      <Outlet />
    </main>
  );
};

export const Route = createRootRoute({
  component: Wrapper,
});
