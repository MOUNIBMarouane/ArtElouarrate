import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is authenticated on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("userToken");
      const userInfo = localStorage.getItem("userInfo");

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
      const response = await api.auth.login({ email, password });

      // Handle both response structures: direct data or nested data
      const responseData = (response.data as any)?.data || response.data;
      const { token, user: userData } = responseData;

      // Store auth data
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(userData));

      setUser(userData as User);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await api.auth.register(userData);
      console.log("Registration response:", response);

      // Handle the response format from our backend
      const responseData = response?.data || response;
      const { token, user: newUser } = responseData;

      if (!token || !newUser) {
        throw new Error("Invalid response format from server");
      }

      // Store auth data
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      localStorage.setItem("isUserAuthenticated", "true");

      setUser(newUser as User);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = (): void => {
    // Clear local storage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isUserAuthenticated");

    // Clear user state
    setUser(null);

    // Optionally call logout endpoint
    try {
      api.auth.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      // This would call a profile update endpoint when implemented
      const updatedUser = { ...user, ...data } as User;
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      // This would refresh the JWT token when implemented
      const response = await api.auth.me();
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
