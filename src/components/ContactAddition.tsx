"use client";

import React, { useState } from "react";
import Form from "next/form";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const ContactAddition = () => {
  const { userId } = useAuth();
  const [receiverPubkey, setReceiverPubkey] = useState<string>();
  const [receiverUsername, setReceiverUsername] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const adding_user = async () => {
    if (!receiverPubkey || !receiverUsername) {
      throw new Error(
        `Receipent username or receipent publickey either is missing `
      );
    }
    try {
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
      if (!response) {
        throw new Error(`Error while passing contact data`);
      }
      setIsLoading(true);
    } catch (error) {
      throw new Error(`Error while Creating Contact while passing data`);
    }
  };

  return (
    <div>
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
                "text-zinc-900 dark:text-zinc-100"
              )}
            />
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter Username "
              value={receiverUsername}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReceiverUsername(e.target.value)
              }
              className={cn(
                "w-full",
                "bg-zinc-50 dark:bg-zinc-800/50",
                "border-zinc-200 dark:border-zinc-700",
                "focus:border-zinc-300 dark:focus:border-zinc-600",
                "text-zinc-900 dark:text-zinc-100"
              )}
            />
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 flex gap-2 items-center">
        <Button
          variant="secondary"
          size="default"
          className={cn(
            "w-full",
            "bg-zinc-900 dark:bg-zinc-100",
            "hover:bg-zinc-700 dark:hover:bg-zinc-300",
            "text-white dark:text-zinc-900",
            "shadow-xs",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={adding_user}
          disabled={!receiverUsername || !receiverUsername || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </div>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactAddition;
