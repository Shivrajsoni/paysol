"use client";

import { ThemeProvider } from "./theme-provider";
import { PaymentProvider } from "@/context/PaymentContext";
import { ContactProvider } from "@/context/ContactContext";
import WalletConnector from "./walletConnector";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ContactProvider>
        <PaymentProvider>
          <WalletConnector>{children}</WalletConnector>
        </PaymentProvider>
      </ContactProvider>
    </ThemeProvider>
  );
}
