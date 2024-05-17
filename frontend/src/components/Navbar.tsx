import { Button } from "@radix-ui/themes";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import userService from "../api/users";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const logout = async () => {
    await userService.logout();
    setUser(undefined);

    navigate({ to: "/login" });
  };

  return (
    <nav className="flex flex-row justify-between items-center w-full h-24 min-h-24">
      <div className="icon flex flex-row items-center gap-2 pointer-events-none select-none">
        <img src="/logo.svg" alt="logo" className="w-8 h-8" />
        <span className="text-2xl font-semibold">stbank</span>
      </div>
      <section className="flex flex-row items-end gap-4">
        <span className="text-sm">
          Logged in as <span className="font-semibold">{user?.username}</span>
        </span>
        <Button variant="ghost" onClick={logout}>
          <LogOut strokeWidth={2} size={16} />
          Logout
        </Button>
      </section>
    </nav>
  );
};

export default Navbar;
