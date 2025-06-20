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
import { PlusCircle, Clock, Shield, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import WalletButton from "./ui/WalletButton";
import { ModeToggle } from "./ThemeToggleButton";
import { motion, useScroll, useTransform } from "framer-motion";

const Header = () => {
  const { userId } = useAuth();
  const { publicKey } = useWallet();
  const [isSynced, setIsSynced] = useState(false);

  // Animate header on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 80], [0, -16]);
  const opacity = useTransform(scrollY, [0, 80], [1, 0.95]);
  const boxShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 4px 16px -4px rgba(0,0,0,0.1)", "0 8px 24px -4px rgba(0,0,0,0.15)"]
  );

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
  }, [userId, publicKey, isSynced]);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      style={{
        y,
        opacity,
        boxShadow,
      }}
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
    >
      {/* Main header container */}
      <div className="relative w-full">
        {/* Background with gradient and blur */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-zinc-50/95 via-zinc-50/95 to-zinc-100/95 dark:from-zinc-900/95 dark:via-zinc-900/95 dark:to-zinc-800/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Content container */}
        <div className="relative w-full">
          <motion.div
            className={cn(
              "flex items-center justify-between",
              "bg-white/20 dark:bg-zinc-900/20",
              "backdrop-blur-md",
              "border-b",
              "border-zinc-200/30 dark:border-zinc-800/30",
              "px-6 py-3",
              "relative",
              "transition-all duration-200 ease-in-out",
              "hover:bg-white/30 dark:hover:bg-zinc-900/30",
              "shadow-sm",
              "ring-1 ring-zinc-200/20 dark:ring-zinc-800/20"
            )}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* Logo and Brand */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2 group transition-all duration-200 hover:scale-[1.02]"
              >
                <motion.div
                  className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 flex items-center justify-center shadow-md overflow-hidden"
                  animate={{
                    boxShadow: [
                      "0 0 0px 0px #60a5fa",
                      "0 0 8px 2px #60a5fa66",
                      "0 0 0px 0px #60a5fa",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 z-0 shimmer" />
                  <div className="relative z-10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                    <Send className="w-2 h-2 text-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                </motion.div>
                <motion.span
                  className="font-bold text-xl bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Erite
                </motion.span>
              </Link>
              <motion.div
                className="h-5 w-px bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </motion.div>

            {/* Navigation and Actions */}
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Payment Request Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/payment-request"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5",
                    "bg-gradient-to-r from-blue-500 to-blue-600",
                    "hover:from-blue-600 hover:to-blue-700",
                    "text-white",
                    "rounded-lg",
                    "transition-all duration-200",
                    "text-sm font-medium",
                    "shadow-sm shadow-blue-500/10",
                    "hover:shadow-md hover:shadow-blue-500/20",
                    "h-8"
                  )}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  New Payment
                </Link>
              </motion.div>

              {/* Pending Requests Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/pending-requests"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5",
                    "bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900",
                    "hover:from-zinc-200 hover:to-zinc-100 dark:hover:from-zinc-700 dark:hover:to-zinc-800",
                    "text-zinc-900 dark:text-zinc-100",
                    "rounded-lg",
                    "transition-all duration-200",
                    "text-sm font-medium",
                    "shadow-sm shadow-zinc-200/10 dark:shadow-zinc-900/10",
                    "hover:shadow-md hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20",
                    "h-8"
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Pending
                </Link>
              </motion.div>

              {/* Wallet Connection */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <WalletButton className="!scale-90" />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ModeToggle />
              </motion.div>

              {/* User Account */}
              <motion.div
                className="flex items-center gap-1.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      className={cn(
                        "px-3 py-1.5",
                        "bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-100 dark:to-zinc-200",
                        "text-zinc-100 dark:text-zinc-900",
                        "rounded-lg",
                        "hover:from-zinc-800 hover:to-zinc-700 dark:hover:from-zinc-200 dark:hover:to-zinc-300",
                        "transition-all duration-200",
                        "text-sm font-medium",
                        "shadow-sm shadow-zinc-900/10 dark:shadow-zinc-100/10",
                        "hover:shadow-md hover:shadow-zinc-900/20 dark:hover:shadow-zinc-100/20",
                        "h-8"
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
                        avatarBox:
                          "w-8 h-8 rounded-lg shadow-sm shadow-zinc-200/10 dark:shadow-zinc-900/10",
                      },
                    }}
                  />
                </SignedIn>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .shimmer {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          animation: shimmer-move 3s infinite linear;
          opacity: 0.5;
        }
        @keyframes shimmer-move {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
