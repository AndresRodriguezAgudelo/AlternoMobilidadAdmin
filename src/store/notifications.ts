import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ElementType } from 'react';

export interface Notification {
  id: string;
  isPositive: boolean;
  icon: ElementType;
  text: string;
  duration?: number;
  createdAt: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => 
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: uuidv4(),
          createdAt: Date.now(),
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
