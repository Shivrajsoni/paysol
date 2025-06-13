"use client";
import { useState } from "react";
import { useContact } from "@/context/ContactContext";
import { usePayment } from "@/context/PaymentContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, Users, ArrowRight } from "lucide-react";

export default function PaymentForm() {
  const { selectedContact } = useContact();
  const { sendPayment } = usePayment();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact || !amount) return;

    setIsLoading(true);

    try {
      await sendPayment(selectedContact.publicKey, parseFloat(amount));

      toast({
        variant: "success",
        //@ts-ignore
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Payment Successful!</span>
          </div>
        ),
        description: (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium">Transaction Details:</p>
            <div className="text-sm space-y-1">
              <p>• Amount: {amount} SOL</p>
              <p>• Recipient: {selectedContact.username}</p>
              <p>
                • Public Key: {selectedContact.publicKey.slice(0, 6)}...
                {selectedContact.publicKey.slice(-6)}
              </p>
              <p>• Status: Completed</p>
            </div>
          </div>
        ),
        duration: 5000,
      });

      setAmount("");
    } catch (error) {
      console.error("Payment error:", error);

      toast({
        variant: "destructive",
        //@ts-ignore
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span>Payment Failed</span>
          </div>
        ),
        description: (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium">Error Details:</p>
            <div className="text-sm">
              <p>
                {error instanceof Error
                  ? error.message
                  : "Failed to process payment. Please try again."}
              </p>
            </div>
          </div>
        ),
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Users className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Quick & Easy Payments
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Select a contact from your list to start sending SOL instantly. Your
            trusted network is just a click away.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Choose a contact</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Amount (SOL)
        </label>
        <Input
          id="amount"
          type="number"
          step="0.000000001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in SOL"
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !amount}>
        {isLoading ? "Processing..." : "Send Payment"}
      </Button>
    </form>
  );
}
