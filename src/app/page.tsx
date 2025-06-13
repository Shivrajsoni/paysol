import Card02 from "@/@/components/xui/card-02";
import ContactAddition from "@/components/ContactAddition";
import GetAllContactPage from "@/components/GetAllContactPage";
import RecentTransactionPage from "@/components/RecentTransactionPage";
import { Wallet, Users, Clock } from "lucide-react";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-600 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-400 mb-4 animate-fade-in">
            Pay to the Known One's
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg animate-fade-in-delay">
            Send payments securely and instantly using Solana blockchain only to
            the known one's
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Payment Card and Transactions */}
            <div className="space-y-8">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Send Payment
                  </h2>
                </div>
                <Card02 />
              </div>

              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Recent Transactions
                  </h2>
                </div>
                <RecentTransactionPage />
              </div>
            </div>

            {/* Right Column - Contacts */}
            <div className="space-y-8">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Add New Contact
                  </h2>
                </div>
                <ContactAddition />
              </div>

              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    All Contacts
                  </h2>
                </div>
                <GetAllContactPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
