import { useState, ReactNode, useEffect } from "react";
import API_URL from "../config/api"; // ✅ TypeScript declaration
import { AuthContext } from "./AuthContextProvider";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem("token"));

  const parseJSON = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("Backend did not return JSON:", text);
      throw new Error("Server error: invalid response");
    }
  };

  const signup = async (name: string, email: string, password: string, role: "owner" | "buyer" = "buyer") => {
    try {
      console.log("\n🔷 FRONTEND SIGNUP:", { name, email, selectedRole: role });
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password, role }),
      });
      const data = await parseJSON(res);
      console.log("🔷 SIGNUP RESPONSE RECEIVED:", { role: data.role, email: data.email });
      if (!res.ok) throw new Error(data.message || "Signup failed");

      const userObj = { user_id: data.user_id, email: data.email, fullName: data.fullName, role: data.role || "buyer" };
      console.log("🔷 STORING IN LOCALSTORAGE AFTER SIGNUP:", userObj);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(userObj));

      setUser(userObj);
      setToken(data.accessToken);
      setIsAuthenticated(true);

      alert(`Signup successful! Role: ${userObj.role}`);
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(error.message || "Server error during signup");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("\n🟢 FRONTEND LOGIN:", { email });
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJSON(res);
      console.log("🟢 LOGIN RESPONSE RECEIVED:", { role: data.data.role, email: data.data.email });
      if (!res.ok) throw new Error(data.message || "Login failed");

      const userData = { ...data.data, role: data.data.role || "buyer" };
      console.log("🟢 RETRIEVED FROM RESPONSE:", userData);
      console.log("🟢 STORING IN LOCALSTORAGE AFTER LOGIN:", userData);
      localStorage.setItem("token", userData.accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(userData.accessToken);
      setIsAuthenticated(true);

      alert(`Login successful! Role: ${userData.role}`);
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Server error during login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    console.log("\n⏰ APP STARTUP - LOADING FROM LOCALSTORAGE:", { savedToken: !!savedToken, savedUserRaw: savedUser ? JSON.parse(savedUser) : null });
    if (savedToken && savedUser) {
      const user = JSON.parse(savedUser);
      console.log("⏰ SETTING USER FROM STORAGE:", { role: user.role, email: user.email });
      // Fix: If role is missing or wrong, it will be corrected on next login
      setToken(savedToken);
      setUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
