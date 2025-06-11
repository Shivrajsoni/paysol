"use client";
import React from "react";
import RecentTransaction from "./RecentTransaction";

const RecentTransactionPage = () => {
  return (
    <div>
      <div className="flex flex-col">
        <RecentTransaction />
      </div>
    </div>
  );
};

export default RecentTransactionPage;
