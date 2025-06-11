"use client";
import React from "react";
import RequestPayment from "./RequestPayment";
import PendingPayment from "./PendingPayment";
import RecentTransaction from "./RecentTransaction";

const RecentTransactionPage = () => {
  return (
    <div>
      <div className="flex flex-col">
        <RequestPayment />
        <PendingPayment />
        <RecentTransaction />
      </div>
    </div>
  );
};

export default RecentTransactionPage;
