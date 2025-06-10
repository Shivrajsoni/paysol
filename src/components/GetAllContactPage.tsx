"use client";
import { Contact } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type ContactProps = {
  id: string;
  username: string;
  PublicKey: string;
  createdAt: string;
  addedById: string;
};

const GetAllContactPage = () => {
  const { userId } = useAuth();
  const [allContacts, setAllContacts] = useState<ContactProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gettingContact = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `/api/users/allContactFetch?clerkId=${userId}`
        );
        const data = await response.json();
        setAllContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    gettingContact();
  }, [userId]);

  if (isLoading) {
    return <div>Loading contacts...</div>;
  }

  if (allContacts.length === 0) {
    return <div>No contacts found</div>;
  }

  return (
    <div className="space-y-4">
      {allContacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center gap-4 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Contact className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              {contact.username}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {contact.PublicKey.slice(0, 4)}...{contact.PublicKey.slice(-4)}
            </p>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date(contact.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetAllContactPage;
