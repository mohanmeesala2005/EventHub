import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

// 1. Define internal domain interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// 2. Define the exact shape of the Context properties
interface AuthContextType {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}

// 3. Create context with an undefined default but explicit typescript type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Implement a custom hook with safety assertion
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
