import { createContext, useEffect, useState } from "react";
import userService from "../api/users";

const AuthContext = createContext<
  | {
      user?: User;
      setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      userService.getMe().then(setUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
