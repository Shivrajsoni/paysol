"use client";

import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentDetails {
  recipientPublicKey: string;
  amount: string;
}

type PaymentContextType = {
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (details: PaymentDetails | null) => void;
  sendPayment: (publicKey: string, amount: number) => Promise<void>;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );

  const sendPayment = async (publicKey: string, amount: number) => {
    try {
      // Here you would implement the actual payment logic
      // For now, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: "Payment Processed",
        description: `Successfully sent ${amount} SOL.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description:
          error instanceof Error ? error.message : "Failed to process payment.",
      });
      throw error;
    }
  };

  return (
    <PaymentContext.Provider
      value={{ paymentDetails, setPaymentDetails, sendPayment }}
    >
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
