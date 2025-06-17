"use client";
import { Wallet, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useRef } from "react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { toast } from "sonner";
import { useContact } from "@/context/ContactContext";
import { usePayment } from "@/context/PaymentContext";

export default function PaymentCard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { selectedContact } = useContact();
  const { paymentDetails, setPaymentDetails } = usePayment();
  const [receiverPubkey, setReceiverPubkey] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPriority, setIsPriority] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<{
    status:
      | "idle"
      | "processing"
      | "confirming"
      | "storing"
      | "success"
      | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Reset transaction status after 5 seconds of success/error
  useEffect(() => {
    if (
      transactionStatus.status === "success" ||
      transactionStatus.status === "error"
    ) {
      const timer = setTimeout(() => {
        setTransactionStatus({ status: "idle", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transactionStatus.status]);

  // Handle payment details from context
  useEffect(() => {
    if (paymentDetails) {
      setReceiverPubkey(paymentDetails.recipientPublicKey);
      setAmount(paymentDetails.amount);
      // Focus on amount input after a short delay
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 500);
      // Clear the context after using it
      setPaymentDetails(null);
    }
  }, [paymentDetails, setPaymentDetails]);

  // Handle selected contact
  useEffect(() => {
    if (selectedContact) {
      setReceiverPubkey(selectedContact.publicKey);
      // Focus on amount input after a short delay
      setTimeout(() => {
        amountInputRef.current?.focus();
      }, 500);
    }
  }, [selectedContact]);

  const handleSendSol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !sendTransaction) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!receiverPubkey || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setTransactionStatus({
        status: "processing",
        message: "Preparing transaction...",
      });

      // Validate receiver public key
      let receiverPublicKey;
      try {
        receiverPublicKey = new PublicKey(receiverPubkey);
      } catch (error) {
        console.log(error);
        toast.error("Invalid receiver public key");
        setTransactionStatus({
          status: "error",
          message: "Invalid receiver address",
        });
        return;
      }

      // Validate amount
      const transferAmount = Number(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        toast.error("Please enter a valid amount");
        setTransactionStatus({ status: "error", message: "Invalid amount" });
        return;
      }

      const lamports = transferAmount * LAMPORTS_PER_SOL;

      // Check balance
      const balance = await connection.getBalance(publicKey);
      if (balance < lamports) {
        toast.error("Insufficient balance");
        setTransactionStatus({
          status: "error",
          message: "Insufficient balance",
        });
        return;
      }

      setTransactionStatus({
        status: "processing",
        message: "Creating transaction...",
      });

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPublicKey,
          lamports,
        })
      );

      // Add priority fee if selected
      if (isPriority) {
        setTransactionStatus({
          status: "processing",
          message: "Calculating priority fee...",
        });
        // Get recent priority fee
        const priorityFee = await connection.getRecentPrioritizationFees();
        console.log("Raw priority fees:", priorityFee);

        if (priorityFee && priorityFee.length > 0) {
          // Sort fees in ascending order
          const sortedFees = priorityFee
            .map((fee) => fee.prioritizationFee)
            .sort((a, b) => a - b);

          console.log("Sorted fees:", sortedFees);

          // Calculate median
          let medianFee;
          const mid = Math.floor(sortedFees.length / 2);

          if (sortedFees.length % 2 === 0) {
            // If even number of fees, take average of two middle values
            medianFee = (sortedFees[mid - 1] + sortedFees[mid]) / 2;
          } else {
            // If odd number of fees, take middle value
            medianFee = sortedFees[mid];
          }

          console.log("Median fee:", medianFee);

          // Ensure minimum priority fee (e.g., 1000 micro-lamports)
          const minimumFee = 1000;
          const finalFee = Math.max(medianFee, minimumFee);

          console.log("Final priority fee:", finalFee);

          // Add compute budget instruction to set priority fee
          const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: finalFee,
          });
          transaction.add(modifyComputeUnits);

          // Show priority fee info to user
          toast.info(
            `Priority fee added: ${finalFee} micro-lamports per compute unit`
          );
        } else {
          console.log("No priority fees available, using default minimum");
          // Use a default minimum fee if no recent fees are available
          const defaultFee = 1000;
          const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: defaultFee,
          });
          transaction.add(modifyComputeUnits);
          toast.info(
            `Default priority fee added: ${defaultFee} micro-lamports per compute unit`
          );
        }
      }

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      setTransactionStatus({
        status: "confirming",
        message: "Waiting for wallet confirmation...",
      });

      // Send transaction to wallet for signing
      const signature = await sendTransaction(transaction, connection);

      setTransactionStatus({
        status: "confirming",
        message: "Confirming transaction...",
      });

      // Wait for confirmation
      const status = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (status.value.err) {
        throw new Error("Transaction failed");
      }

      setTransactionStatus({
        status: "storing",
        message: "Storing transaction details...",
      });

      // Store transaction in database
      try {
        const response = await fetch("/api/transaction/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature,
            from: publicKey.toString(),
            to: receiverPubkey,
            amount: amount.toString(),
            priorityFee: isPriority ? "enabled" : "disabled",
          }),
        });

        if (!response.ok) {
          console.error("Failed to store transaction:", await response.text());
        }
      } catch (error) {
        console.error("Error storing transaction:", error);
      }

      setTransactionStatus({
        status: "success",
        message: "Payment sent successfully!",
      });
      toast.success("Payment sent successfully!");
      setAmount("");
      setReceiverPubkey("");
    } catch (error) {
      console.error("Error sending payment:", error);
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          toast.error("Transaction was rejected by user");
          setTransactionStatus({
            status: "error",
            message: "Transaction rejected",
          });
        } else if (error.message.includes("invalid account")) {
          toast.error("Invalid transaction. Please try again.");
          setTransactionStatus({
            status: "error",
            message: "Invalid transaction",
          });
        } else {
          toast.error(error.message);
          setTransactionStatus({ status: "error", message: error.message });
        }
      } else {
        toast.error("Failed to send payment. Please try again.");
        setTransactionStatus({
          status: "error",
          message: "Transaction failed",
        });
      }
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
            <div className="relative group">
              <Input
                ref={amountInputRef}
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

            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="priorityFee"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="h-4 w-4 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 rounded focus:ring-zinc-500"
                disabled={!publicKey || isLoading}
              />
              <label
                htmlFor="priorityFee"
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                Add priority fee for faster transaction confirmation
              </label>
            </div>

            <Button
              onClick={handleSendSol}
              disabled={!publicKey || isLoading}
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
                transactionStatus.status === "success" &&
                  "bg-green-600 hover:bg-green-700",
                transactionStatus.status === "error" &&
                  "bg-red-600 hover:bg-red-700"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {transactionStatus.message}
                </div>
              ) : transactionStatus.status === "success" ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {transactionStatus.message}
                </div>
              ) : transactionStatus.status === "error" ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {transactionStatus.message}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Payment
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
