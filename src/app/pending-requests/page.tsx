"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePayment } from "@/context/PaymentContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface PendingPayment {
  id: string;
  amount: string;
  createdAt: string;
  senderUsername: string;
}

export default function PendingRequestsPage() {
  return <PendingRequestsContent />;
}

function PendingRequestsContent() {
  const { publicKey } = useWallet();
  const { setPaymentDetails } = usePayment();
  const { toast } = useToast();
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPayments = useCallback(async () => {
    if (!publicKey) return;

    try {
      const response = await fetch(
        `/api/payment/pending?recipientPublicKey=${publicKey.toString()}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPendingPayments(data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch pending payments",
      });
    } finally {
      setLoading(false);
    }
  }, [publicKey, toast]);

  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  const handleAccept = async (paymentId: string) => {
    try {
      const payment = pendingPayments.find((p) => p.id === paymentId);
      if (!payment) throw new Error("Payment not found");

      setPaymentDetails({
        recipientPublicKey: payment.senderUsername,
        amount: payment.amount,
      });

      toast({
        title: "Payment Accepted",
        description: "The payment has been accepted successfully.",
      });
      fetchPendingPayments();
    } catch (error) {
      console.error("Error accepting payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept payment",
      });
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      // Implement reject payment logic here
      toast({
        title: "Payment Rejected",
        description: "The payment has been rejected.",
      });
      fetchPendingPayments();
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject payment",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">
              Please connect your wallet to view pending payments
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <p className="text-center text-gray-500">No pending payments</p>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          From: {payment.senderUsername || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Amount: {payment.amount} SOL
                        </p>
                        <p className="text-sm text-gray-500">
                          Requested:{" "}
                          {formatDistanceToNow(new Date(payment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(payment.id)}
                          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(payment.id)}
                          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
