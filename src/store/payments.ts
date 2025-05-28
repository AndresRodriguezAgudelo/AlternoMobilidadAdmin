import { create } from 'zustand';
import { PaymentData, PaymentMeta } from '../customHooks/pages/payments/customHook';

interface PaymentsStoreState {
  payments: PaymentData[];
  meta: PaymentMeta | null;
  setPayments: (payments: PaymentData[]) => void;
  setMeta: (meta: PaymentMeta | null) => void;
  clearPayments: () => void;
}

export const usePaymentsStore = create<PaymentsStoreState>((set) => ({
  payments: [],
  meta: null,
  setPayments: (payments) => set({ payments }),
  setMeta: (meta) => set({ meta }),
  clearPayments: () => set({ payments: [], meta: null }),
}));
