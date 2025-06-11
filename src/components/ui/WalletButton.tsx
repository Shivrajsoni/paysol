"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface WalletButtonProps {
  className?: string;
}

const WalletButton = ({ className }: WalletButtonProps) => {
  return <WalletMultiButton className={className} />;
};

export default WalletButton;
