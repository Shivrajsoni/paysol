import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import WalletConnector from "@/components/walletConnector";
import { ContactProvider } from "@/context/ContactContext";
import { PaymentProvider } from "@/context/PaymentContext";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PaymentProvider>
        <WalletConnector>
          <ContactProvider>
            <Header />
            {children}
          </ContactProvider>
        </WalletConnector>
      </PaymentProvider>
    </ThemeProvider>
  );
};

export default Provider;
