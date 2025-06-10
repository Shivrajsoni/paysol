"use client";
import { Wallet, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "sonner";

export default function PaymentCard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [receiverPubkey, setReceiverPubkey] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendSol = useCallback(async () => {
    try {
      if (!publicKey || !sendTransaction) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!receiverPubkey || !amount) {
        toast.error("Please fill in all fields");
        return;
      }

      setIsLoading(true);

      // Validate receiver public key
      let receiverPublicKey;
      try {
        receiverPublicKey = new PublicKey(receiverPubkey);
      } catch (error) {
        toast.error("Invalid receiver public key");
        return;
      }

      // Validate amount
      const transferAmount = Number(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const lamports = transferAmount * LAMPORTS_PER_SOL;

      // Check balance
      const balance = await connection.getBalance(publicKey);
      if (balance < lamports) {
        toast.error("Insufficient balance");
        return;
      }

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // Create transaction
      const transaction = new Transaction();

      // Add transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPublicKey,
          lamports,
        })
      );

      // Set transaction properties
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      try {
        // Send transaction to wallet for signing
        const signature = await sendTransaction(transaction, connection);

        // Wait for confirmation
        const status = await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        if (status.value.err) {
          throw new Error("Transaction failed");
        }

        toast.success("Transaction successful!");
        setReceiverPubkey("");
        setAmount("");
      } catch (error) {
        console.error("Transaction failed:", error);
        if (error instanceof Error) {
          if (error.message.includes("user rejected")) {
            toast.error("Transaction was rejected by user");
          } else if (error.message.includes("invalid account")) {
            toast.error("Invalid transaction. Please try again.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error("Transaction failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, receiverPubkey, amount, connection, sendTransaction]);

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
                <Wallet className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Send Payment
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-0.5">
                {publicKey
                  ? "Connected: " +
                    publicKey.toString().slice(0, 4) +
                    "..." +
                    publicKey.toString().slice(-4)
                  : "Connect your wallet"}
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
                  "text-zinc-900 dark:text-zinc-100"
                )}
                disabled={!publicKey || isLoading}
              />
            </div>
            <div className="relative">
              <Input
                type="number"
                step="0.000000001"
                placeholder="Enter amount in SOL"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
                className={cn(
                  "w-full",
                  "bg-zinc-50 dark:bg-zinc-800/50",
                  "border-zinc-200 dark:border-zinc-700",
                  "focus:border-zinc-300 dark:focus:border-zinc-600",
                  "text-zinc-900 dark:text-zinc-100"
                )}
                disabled={!publicKey || isLoading}
              />
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2 items-center">
          <Button
            variant="default"
            size="sm"
            className={cn(
              "w-full",
              "bg-zinc-900 dark:bg-zinc-100",
              "hover:bg-zinc-700 dark:hover:bg-zinc-300",
              "text-white dark:text-zinc-900",
              "shadow-xs",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSendSol}
            disabled={!publicKey || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Pay Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
