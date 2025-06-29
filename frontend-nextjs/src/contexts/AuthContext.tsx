"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: "USER" | "ADMIN";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to safely access localStorage (for SSR compatibility)
const getLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

// Helper function to safely set localStorage (for SSR compatibility)
const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

// Helper function to safely remove from localStorage (for SSR compatibility)
const removeLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is authenticated on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = getLocalStorage("userToken");
      const userInfo = getLocalStorage("userInfo");

      if (token && userInfo) {
        try {
          setUser(JSON.parse(userInfo));
          // Optionally verify token with backend
          await refreshToken();
        } catch (error) {
          console.error("Auth initialization failed:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.login({ email, password });

      // Handle both response structures: direct data or nested data
      const responseData = (response.data as any)?.data || response.data;
      const { token, user: userData } = responseData;

      // Store auth data
      setLocalStorage("userToken", token);
      setLocalStorage("userInfo", JSON.stringify(userData));

      setUser(userData as User);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await authApi.register(userData);
      console.log("Registration response:", response);

      // Handle the response format from our backend
      const responseData = response?.data || response;
      const { token, user: newUser } = responseData;

      if (!token || !newUser) {
        throw new Error("Invalid response format from server");
      }

      // Store auth data
      setLocalStorage("userToken", token);
      setLocalStorage("userInfo", JSON.stringify(newUser));
      setLocalStorage("isUserAuthenticated", "true");

      setUser(newUser as User);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = (): void => {
    // Clear local storage
    removeLocalStorage("userToken");
    removeLocalStorage("userInfo");
    removeLocalStorage("isUserAuthenticated");

    // Clear user state
    setUser(null);

    // Optionally call logout endpoint
    try {
      authApi.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      // This would call a profile update endpoint when implemented
      const updatedUser = { ...user, ...data } as User;
      setUser(updatedUser);
      setLocalStorage("userInfo", JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      // This would refresh the JWT token when implemented
      const response = await authApi.getProfile();
      const responseData = (response.data as any)?.data || response.data;
      setUser(responseData as User);
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
