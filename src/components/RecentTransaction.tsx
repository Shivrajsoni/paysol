"use client";

import { useAuth } from "@clerk/nextjs";
import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";

const RecentTransaction = () => {
  const [RecentTransaction, setRecentTransaction] = useState();
  const { userId } = useAuth();
  const { publicKey } = useWallet();

  return <div></div>;
};

export default RecentTransaction;
