"use client";

import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { useWallet } from "@solana/wallet-adapter-react";

const Header = () => {
  const { userId } = useAuth();
  const { publicKey } = useWallet();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const syncUserData = async () => {
      if (!userId || isSynced) return;

      try {
        const response = await fetch("api/users", {
          method: "POST",
          body: JSON.stringify({
            clerkId: userId,
            publicKey: publicKey?.toString() || null,
            username: userId,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });

        if (response.ok) {
          setIsSynced(true);
        }
      } catch (error) {
        console.error("Error syncing user data:", error);
      }
    };

    syncUserData();
  }, [userId, publicKey]);

  return (
    <div className="flex justify-end items-center p-4 gap-4 h-16">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Header;
