"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  className?: string;
}

const WalletButton = ({ className }: WalletButtonProps) => {
  return (
    <div className={cn("wallet-adapter-button-trigger", className)}>
      <style jsx global>{`
        .wallet-adapter-button-trigger {
          background: transparent !important;
          padding: 0 !important;
          height: auto !important;
          font-family: inherit !important;
          font-size: inherit !important;
          line-height: inherit !important;
          border: none !important;
          box-shadow: none !important;
          transition: all 0.2s ease-in-out !important;
        }

        .wallet-adapter-button-trigger:hover {
          background: transparent !important;
          transform: scale(1.02) !important;
        }

        .wallet-adapter-button-trigger:active {
          transform: scale(0.98) !important;
        }

        .wallet-adapter-button {
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 0.5rem 1rem !important;
          background: linear-gradient(
            to right,
            rgb(24 24 27),
            rgb(39 39 42)
          ) !important;
          color: white !important;
          border-radius: 0.5rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          transition: all 0.2s ease-in-out !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        .wallet-adapter-button:hover {
          background: linear-gradient(
            to right,
            rgb(39 39 42),
            rgb(63 63 70)
          ) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }

        .wallet-adapter-button:active {
          transform: scale(0.98) !important;
        }

        .wallet-adapter-button-end-icon,
        .wallet-adapter-button-start-icon {
          display: none !important;
        }

        .wallet-adapter-button-end-icon img,
        .wallet-adapter-button-start-icon img {
          width: 1.25rem !important;
          height: 1.25rem !important;
        }

        .wallet-adapter-modal {
          background: rgb(24 24 27) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
        }

        .wallet-adapter-modal-button-close {
          background: transparent !important;
          border: none !important;
          color: rgb(161 161 170) !important;
          transition: all 0.2s ease-in-out !important;
        }

        .wallet-adapter-modal-button-close:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        .wallet-adapter-modal-list {
          margin: 0 !important;
          padding: 0.5rem !important;
        }

        .wallet-adapter-modal-list .wallet-adapter-button {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          margin: 0.25rem 0 !important;
          width: 100% !important;
          justify-content: flex-start !important;
        }

        .wallet-adapter-modal-list .wallet-adapter-button:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .wallet-adapter-modal-title {
          color: white !important;
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          margin: 0 !important;
          padding: 1rem !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
      <WalletMultiButton className="!scale-90" />
    </div>
  );
};

export default WalletButton;
