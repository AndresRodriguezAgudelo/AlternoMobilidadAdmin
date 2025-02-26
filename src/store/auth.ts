import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const getInitialToken = () => {
  const token = localStorage.getItem('token');
  console.log('[Auth Store] Initial token:', token);
  return token;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setToken: (token) => {
    console.log('[Auth Store] Setting token:', token);
    if (token) {
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true });
      console.log('[Auth Store] Token stored and state updated');
    } else {
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false });
      console.log('[Auth Store] Token removed and state cleared');
    }
  },
  
  logout: () => {
    console.log('[Auth Store] Logging out');
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    console.log('[Auth Store] Logout complete - State cleared');
  }
}));
