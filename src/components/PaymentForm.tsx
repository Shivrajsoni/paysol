"use client";
import { useState } from "react";
import { useContact } from "@/context/ContactContext";
import { usePayment } from "@/context/PaymentContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";

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

      // Enhanced success toast
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
        duration: 5000, // Show for 5 seconds
      });

      setAmount("");
    } catch (error) {
      console.error("Payment error:", error);

      // Enhanced error toast
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
      <div className="text-center py-8">
        <p className="text-zinc-500 dark:text-zinc-400">
          Please select a contact to make a payment
        </p>
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
