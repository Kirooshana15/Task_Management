import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

export type Role = "admin" | "coordinator" | "developer";

export interface User {
  id: string; // The backend returns user._id which we'll map to id
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Attempt to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("serviceflow_token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          if (res.data.success) {
            const dbUser = res.data.data.user;
            setUser({
              id: dbUser._id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role as Role,
              avatar: dbUser.avatar,
            });
            // Fetch users for directories
            const usersRes = await api.get("/auth/users");
            if (usersRes.data.success) setUsers(usersRes.data.data.users);
          }
        } catch (err) {
          console.error("Failed to restore session", err);
          localStorage.removeItem("serviceflow_token");
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data.success) {
        const { token } = response.data.data;
        // Save the token globally
        localStorage.setItem("serviceflow_token", token);
        
        // Fetch current user details since it's no longer in the login response
        const meRes = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        if (meRes.data.success) {
          const dbUser = meRes.data.data.user;
          setUser({
            id: dbUser._id || dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as Role,
            avatar: dbUser.avatar,
          });
        }
        
        // Fetch ALL users for directories
        try {
           const usersRes = await api.get("/auth/users", { headers: { Authorization: `Bearer ${token}` } });
           if (usersRes.data.success) setUsers(usersRes.data.data.users);
        } catch(e) {}

        return true;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
    return false;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout endpoint error, clearing locally", err);
    } finally {
      localStorage.removeItem("serviceflow_token");
      setUser(null);
      setUsers([]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
