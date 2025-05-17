"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User } from "../supabase/types";
import { createUser, getUser } from "../supabase/client";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSavedUser = () => {
      try {
        const savedUser =
          typeof window !== "undefined"
            ? localStorage.getItem("esc-user")
            : null;
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Fehler beim Parsen des gespeicherten Benutzers:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem("esc-user");
        }
      }
      setIsLoading(false);
    };

    checkSavedUser();
  }, []);

  const login = async (name: string) => {
    if (!name) return;

    setIsLoading(true);
    try {
      // Prüfen, ob Benutzer bereits existiert
      let user = await getUser(name);

      // Wenn nicht, neuen Benutzer erstellen
      if (!user) {
        user = await createUser(name);
      }

      setUser(user);
      if (typeof window !== "undefined") {
        localStorage.setItem("esc-user", JSON.stringify(user));
      }
    } catch (error) {
      console.error("Fehler beim Anmelden:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("esc-user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth muss innerhalb eines AuthProviders verwendet werden"
    );
  }
  return context;
};
