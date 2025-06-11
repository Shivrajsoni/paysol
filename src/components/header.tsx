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
import Link from "next/link";
import {
  ArrowUpRight,
  PartyPopper,
  Snowflake,
  PlusCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import WalletButton from "./ui/WalletButton";

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
    <div className="w-full">
      <div className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-zinc-50/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80 backdrop-blur-md w-full">
          <div className="flex items-center justify-center">
            <div
              className={cn(
                "flex items-center justify-between",
                "bg-white/40 dark:bg-zinc-900/40",
                "shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]",
                "backdrop-blur-md",
                "border-x border-b",
                "border-zinc-200/50 dark:border-zinc-800/50",
                "w-[95%] max-w-[1200px]",
                "rounded-b-[28px]",
                "px-4 py-2.5",
                "relative",
                "transition-all duration-300 ease-in-out"
              )}
            >
              <div className="relative z-10 flex items-center justify-between w-full gap-2">
                {/* Logo and Brand */}
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Snowflake className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      XpaY
                    </span>
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                </div>

                {/* Navigation and Actions */}
                <div className="flex items-center gap-3">
                  {/* Payment Request Button */}
                  <Link
                    href="/payment-request"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2",
                      "bg-blue-500 hover:bg-blue-600",
                      "text-white",
                      "rounded-lg",
                      "transition-colors duration-200",
                      "text-sm font-medium"
                    )}
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Payment
                  </Link>

                  {/* Pending Requests Button */}
                  <Link
                    href="/pending-requests"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2",
                      "bg-zinc-100 hover:bg-zinc-200",
                      "dark:bg-zinc-800 dark:hover:bg-zinc-700",
                      "text-zinc-900 dark:text-zinc-100",
                      "rounded-lg",
                      "transition-colors duration-200",
                      "text-sm font-medium"
                    )}
                  >
                    <Clock className="w-4 h-4" />
                    Pending
                  </Link>

                  {/* Wallet Connection */}
                  <WalletButton className="!scale-90" />

                  {/* User Account */}
                  <div className="flex items-center gap-2">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button
                          className={cn(
                            "px-4 py-2",
                            "bg-zinc-900 dark:bg-zinc-100",
                            "text-zinc-100 dark:text-zinc-900",
                            "rounded-lg",
                            "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                            "transition-colors duration-200",
                            "text-sm font-medium"
                          )}
                        >
                          Sign In
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8",
                          },
                        }}
                      />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
