"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PaymentDetails {
  recipientPublicKey: string;
  amount: string;
}

interface PaymentContextType {
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (details: PaymentDetails | null) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  return (
    <PaymentContext.Provider value={{ paymentDetails, setPaymentDetails }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
