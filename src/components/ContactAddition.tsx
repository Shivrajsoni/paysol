"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus, Check, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { PublicKey } from "@solana/web3.js";

const ContactAddition = () => {
  const { userId } = useAuth();
  const [receiverPubkey, setReceiverPubkey] = useState<string>("");
  const [receiverUsername, setReceiverUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  // Reset status after 3 seconds
  useEffect(() => {
    if (status.type !== "idle") {
      const timer = setTimeout(() => {
        setStatus({ type: "idle", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status.type]);

  const adding_user = async () => {
    if (!receiverPubkey || !receiverUsername) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setStatus({ type: "idle", message: "" });

      // Validate public key format
      try {
        new PublicKey(receiverPubkey);
      } catch (error) {
        console.log(error);
        toast.error("Invalid public key format");
        setStatus({ type: "error", message: "Invalid public key" });
        return;
      }

      const response = await fetch("/api/users/contact", {
        method: "POST",
        body: JSON.stringify({
          receiverPubkey,
          receiverUsername,
          userId,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to add contact");
      }

      // Success
      setStatus({ type: "success", message: "Contact added successfully!" });
      toast.success("Contact added successfully!", {
        description: `${receiverUsername} has been added to your contacts`,
        duration: 3000,
      });

      // Clear form
      setReceiverPubkey("");
      setReceiverUsername("");
    } catch (error) {
      console.error("Error adding contact:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add contact";
      setStatus({ type: "error", message: errorMessage });
      toast.error("Failed to add contact", {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div
        className={cn(
          "relative overflow-hidden",
          "bg-white/50 dark:bg-zinc-900/50",
          "backdrop-blur-xl",
          "border border-zinc-200/50 dark:border-zinc-800/50",
          "rounded-2xl",
          "transition-all duration-300",
          "hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-zinc-900/20",
          "hover:border-zinc-300/50 dark:hover:border-zinc-700/50"
        )}
      >
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden",
                  "ring-2 ring-zinc-100 dark:ring-zinc-800",
                  "flex items-center justify-center",
                  "bg-zinc-50 dark:bg-zinc-800"
                )}
              >
                <Plus className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Add New Contact
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-0.5">
                Enter contact details below
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter receiver's public key"
                value={receiverPubkey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReceiverPubkey(e.target.value)
                }
                className={cn(
                  "w-full",
                  "bg-zinc-50 dark:bg-zinc-800/50",
                  "border-zinc-200 dark:border-zinc-700",
                  "focus:border-zinc-300 dark:focus:border-zinc-600",
                  "text-zinc-900 dark:text-zinc-100",
                  "transition-all duration-200",
                  "hover:border-zinc-300 dark:hover:border-zinc-600"
                )}
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter Username"
                value={receiverUsername}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReceiverUsername(e.target.value)
                }
                className={cn(
                  "w-full",
                  "bg-zinc-50 dark:bg-zinc-800/50",
                  "border-zinc-200 dark:border-zinc-700",
                  "focus:border-zinc-300 dark:focus:border-zinc-600",
                  "text-zinc-900 dark:text-zinc-100",
                  "transition-all duration-200",
                  "hover:border-zinc-300 dark:hover:border-zinc-600"
                )}
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={adding_user}
              disabled={!receiverPubkey || !receiverUsername || isLoading}
              className={cn(
                "w-full",
                "bg-gradient-to-r from-zinc-900 to-zinc-800",
                "hover:from-zinc-800 hover:to-zinc-700",
                "text-white",
                "py-6",
                "rounded-xl",
                "transition-all duration-200",
                "hover:scale-[1.02]",
                "active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                status.type === "success" && "bg-green-600 hover:bg-green-700",
                status.type === "error" && "bg-red-600 hover:bg-red-700"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding contact...
                </div>
              ) : status.type === "success" ? (
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  {status.message}
                </div>
              ) : status.type === "error" ? (
                <div className="flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  {status.message}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Contact
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAddition;
