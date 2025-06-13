import Card02 from "@/@/components/xui/card-02";
import ContactAddition from "@/components/ContactAddition";
import GetAllContactPage from "@/components/GetAllContactPage";
import RecentTransactionPage from "@/components/RecentTransactionPage";
import { Wallet, Users, Clock, Sparkles, Shield, Send } from "lucide-react";

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 bg-gradient-to-r from-zinc-200/30 to-zinc-300/30 dark:from-zinc-700/30 dark:to-zinc-600/30 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl transform rotate-45 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-zinc-200/50 dark:border-zinc-700/50" />
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <div className="relative">
                    <Shield className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                    <Send className="w-4 h-4 text-zinc-600 dark:text-zinc-400 absolute -bottom-1 -right-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] backdrop-blur-sm mb-4">
              <Sparkles className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Secure & Instant Payments
              </span>
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-600 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-400 mb-4 animate-fade-in drop-shadow-sm">
              Pay to the Known One's
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg animate-fade-in-delay leading-relaxed">
              Experience seamless, secure payments on Solana blockchain.
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {" "}
                Only to people you trust.
              </span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Payment Card and Transactions */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner">
                    <Wallet className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Send Payment
                  </h2>
                </div>
                <Card02 />
              </div>

              <div className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner">
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
              <div className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner">
                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Add New Contact
                  </h2>
                </div>
                <ContactAddition />
              </div>

              <div className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner">
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
