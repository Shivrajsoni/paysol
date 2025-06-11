"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ContactContextType = {
  selectedContact: { publicKey: string; username: string } | null;
  setSelectedContact: (
    contact: { publicKey: string; username: string } | null
  ) => void;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [selectedContact, setSelectedContact] = useState<{
    publicKey: string;
    username: string;
  } | null>(null);

  return (
    <ContactContext.Provider value={{ selectedContact, setSelectedContact }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
}
