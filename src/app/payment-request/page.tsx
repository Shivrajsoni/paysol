"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PaymentRequest = () => {
  const { publicKey } = useWallet();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestedPublicKey: "",
    amount: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!user) {
      toast.error("Please sign in to create payment requests");
      return;
    }

    if (!formData.requestedPublicKey || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestedPublicKey: formData.requestedPublicKey,
          amount: formData.amount,
          description: formData.description,
          senderId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment request");
      }

      toast.success("Payment request created successfully!", {
        description: `Request for ${parseFloat(formData.amount).toFixed(
          4
        )} SOL has been sent.`,
        duration: 5000,
      });

      setFormData({
        requestedPublicKey: "",
        amount: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create payment request", {
        description:
          error instanceof Error ? error.message : "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-zinc-200/20">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Create Payment Request
          </h1>

          <p className="text-sm text-gray-500">
            Let&apos;s get started with your first payment request!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="requestedPublicKey"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Recipient's Public Key
              </label>
              <Input
                id="requestedPublicKey"
                name="requestedPublicKey"
                type="text"
                placeholder="Enter recipient's public key"
                value={formData.requestedPublicKey}
                onChange={handleInputChange}
                className="bg-white/50 dark:bg-zinc-800/50 border-zinc-200/20 focus:border-zinc-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Amount (SOL)
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.000000001"
                placeholder="Enter amount in SOL"
                value={formData.amount}
                onChange={handleInputChange}
                className="bg-white/50 dark:bg-zinc-800/50 border-zinc-200/20 focus:border-zinc-400/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description (Optional)
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter payment description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-white/50 dark:bg-zinc-800/50 border-zinc-200/20 focus:border-zinc-400/20 min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !publicKey || !user}
              className="w-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white py-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                "Create Payment Request"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
