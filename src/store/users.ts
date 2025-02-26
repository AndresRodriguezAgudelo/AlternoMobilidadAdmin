import { create } from 'zustand';
import { User, UserResponse } from '../types/user';

interface UsersState {
  users: User[];
  meta: UserResponse['meta'] | null;
  setUsers: (users: User[]) => void;
  setMeta: (meta: UserResponse['meta']) => void;
  clearUsers: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  meta: null,
  setUsers: (users) => set({ users }),
  setMeta: (meta) => set({ meta }),
  clearUsers: () => set({ users: [], meta: null })
}));
