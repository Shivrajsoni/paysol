"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  PublicKey,
  TransactionResponse,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { cn } from "@/lib/utils";

interface Transaction {
  signature: string;
  date: Date;
  recipient: string;
  username: string | null;
  slot: number;
  fee: number;
  status: "Success" | "Failed";
  lamports: number;
}

const RecentTransaction = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const fetchUsername = async (publicKey: string) => {
    try {
      const response = await fetch(
        `/api/users/searchreceipent?query=${publicKey}`
      );
      const data = await response.json();
      if (data.contacts && data.contacts.length > 0) {
        return data.contacts[0].username;
      }
      return null;
    } catch (error) {
      console.error("Error fetching username:", error);
      return null;
    }
  };

  const fetchRecentTransactions = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      });

      const transactionDetails = await Promise.all(
        signatures.map(async (sigInfo) => {
          try {
            const transaction = await connection.getTransaction(
              sigInfo.signature,
              {
                maxSupportedTransactionVersion: 0,
              }
            );

            if (!transaction) return null;

            const recipient = extractRecipient(transaction, publicKey);
            const username = await fetchUsername(recipient);

            const tx: Transaction = {
              signature: sigInfo.signature,
              date: transaction.blockTime
                ? new Date(transaction.blockTime * 1000)
                : new Date(),
              recipient: recipient,
              username: username,
              slot: transaction.slot,
              fee: transaction.meta?.fee || 0,
              status: transaction.meta?.err ? "Failed" : "Success",
              lamports: extractLamportsTransferred(transaction, publicKey),
            };

            return tx;
          } catch (err) {
            console.error("Error fetching transaction details:", err);
            return null;
          }
        })
      );

      setRecentTransactions(
        transactionDetails.filter((tx): tx is Transaction => tx !== null)
      );
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  const extractRecipient = (
    transaction: TransactionResponse | VersionedTransactionResponse,
    userPublicKey: PublicKey
  ): string => {
    try {
      const message = transaction.transaction.message;
      if ("accountKeys" in message) {
        const accountKeys = message.accountKeys;
        const recipient = accountKeys.find(
          (key: PublicKey) => key.toBase58() !== userPublicKey.toBase58()
        );
        return recipient ? recipient.toBase58() : "Unknown";
      }
      return "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const extractLamportsTransferred = (
    transaction: TransactionResponse | VersionedTransactionResponse,
    userPublicKey: PublicKey
  ): number => {
    try {
      const preBalances = transaction.meta?.preBalances || [];
      const postBalances = transaction.meta?.postBalances || [];

      const message = transaction.transaction.message;
      if ("accountKeys" in message) {
        const accountKeys = message.accountKeys;
        const userIndex = accountKeys.findIndex(
          (key: PublicKey) => key.toBase58() === userPublicKey.toBase58()
        );

        if (
          userIndex !== -1 &&
          preBalances[userIndex] &&
          postBalances[userIndex]
        ) {
          const difference = postBalances[userIndex] - preBalances[userIndex];
          return Math.abs(difference);
        }
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSOL = (lamports: number): string => {
    return (lamports / 1000000000).toFixed(4);
  };

  const truncatePublicKey = (pubkey: string): string => {
    if (!pubkey || pubkey === "Unknown") return pubkey;
    const parts = pubkey.split("");
    const firstPart = parts.slice(0, 4).join("");

    return `${firstPart}..`;
  };

  useEffect(() => {
    if (publicKey) {
      fetchRecentTransactions();
    }
  }, [publicKey, fetchRecentTransactions]);

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl">
        <p className="text-red-600 dark:text-red-400 font-medium text-sm">
          Please connect your wallet first
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Transactions
          </h2>
          <button
            onClick={fetchRecentTransactions}
            disabled={loading}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5",
              "bg-zinc-900 dark:bg-zinc-100",
              "text-zinc-100 dark:text-zinc-900",
              "rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200",
              "text-sm"
            )}
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && recentTransactions.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && recentTransactions.length > 0 && (
          <div className="overflow-hidden">
            <div className="min-w-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
              <div className="grid grid-cols-6 gap-3 p-3 bg-zinc-50/50 dark:bg-zinc-800/50 rounded-t-xl text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <div>Date & Time</div>
                <div>Username</div>
                <div>Recipient</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Signature</div>
              </div>
              <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 max-h-[180px] overflow-y-auto">
                {recentTransactions.slice(0, 6).map((tx) => (
                  <div
                    key={tx.signature}
                    className="grid grid-cols-6 gap-3 p-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors text-sm"
                  >
                    <div className="text-zinc-900 dark:text-zinc-100">
                      {formatDate(tx.date)}
                    </div>
                    <div className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {tx.username || "Unknown"}
                    </div>
                    <div className="text-zinc-900 dark:text-zinc-100">
                      <span
                        className="font-mono bg-zinc-100/50 dark:bg-zinc-800/50 px-2 py-0.5 rounded cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
                        title={tx.recipient}
                      >
                        {truncatePublicKey(tx.recipient)}
                      </span>
                    </div>
                    <div className="text-zinc-900 dark:text-zinc-100">
                      {formatSOL(tx.lamports)} SOL
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 text-xs font-semibold rounded-full",
                          tx.status === "Success"
                            ? "bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                            : "bg-red-100/50 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                        )}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-zinc-900 dark:text-zinc-100">
                      <a
                        href={`https://solscan.io/tx/${tx.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
                        title={tx.signature}
                      >
                        {truncatePublicKey(tx.signature)}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Transactions */}
        {!loading && recentTransactions.length === 0 && !error && (
          <div className="text-center py-8">
            <div className="text-zinc-400 dark:text-zinc-500 mb-3">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              No recent transactions found
            </p>
          </div>
        )}

        {/* Connected Wallet Info */}
        <div className="pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Connected Wallet:
            <span className="font-mono ml-2 bg-zinc-100/50 dark:bg-zinc-800/50 px-2 py-0.5 rounded">
              {truncatePublicKey(publicKey.toBase58())}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentTransaction;
