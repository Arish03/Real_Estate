import { useContext } from "react";
import { createContext } from "react";

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  signup: (name: string, email: string, password: string, role: "owner" | "buyer") => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
