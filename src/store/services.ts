import { create } from 'zustand';

export interface Service {
  id: number;
  name: string;
  link: string;
  description: string;
  key: string;
  image?: string;
}

interface ServicesState {
  services: Service[];
  setServices: (services: Service[] | ((prev: Service[]) => Service[])) => void;
  clearServices: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  setServices: (services) => set((state) => ({
    services: typeof services === 'function' ? services(state.services) : services
  })),
  clearServices: () => set({ services: [] })
}));
