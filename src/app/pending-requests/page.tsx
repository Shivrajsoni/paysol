"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { usePayment } from "@/context/PaymentContext";

interface PendingPayment {
  id: string;
  amount: string;
  description: string;
  createdAt: string;
  sender: {
    username: string | null;
    PublicKey: string | null;
  };
}

const PendingPayment = () => {
  const { userId } = useAuth();
  const { publicKey } = useWallet();
  const router = useRouter();
  const { setPaymentDetails } = usePayment();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

  const fetchPendingPayments = async () => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet first");
        return;
      }

      const response = await fetch(
        `/api/payment/pending?recipientPublicKey=${publicKey.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending payments");
      }

      const data = await response.json();
      setPendingPayments(data.data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      toast.error("Failed to fetch pending payments");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, [publicKey]);

  const handlePayOut = (payment: PendingPayment) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!payment.sender.PublicKey) {
      toast.error("Invalid sender public key");
      return;
    }

    // Set payment details in context
    setPaymentDetails({
      recipientPublicKey: payment.sender.PublicKey,
      amount: payment.amount,
    });

    // Redirect to home page
    router.push("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-zinc-200/20">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Connect Wallet
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please connect your wallet to view pending payment requests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-zinc-200/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Pending Payment Requests
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRefreshing(true);
                fetchPendingPayments();
              }}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                No pending payment requests found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200/20">
                    <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      From
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Amount
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Description
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Date
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-zinc-200/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-900 dark:text-white">
                            {payment.sender.username || "Unknown User"}
                          </span>
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            {payment.sender.PublicKey?.slice(0, 8)}...
                            {payment.sender.PublicKey?.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-zinc-900 dark:text-white">
                          {parseFloat(payment.amount).toFixed(4)} SOL
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {payment.description || "No description"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {formatDate(payment.createdAt)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          onClick={() => handlePayOut(payment)}
                          className="bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white"
                        >
                          Pay Now
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingPayment;
