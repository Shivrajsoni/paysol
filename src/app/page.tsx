"use client";

import Card02 from "@/@/components/xui/card-02";
import ContactAddition from "@/components/ContactAddition";
import GetAllContactPage from "@/components/GetAllContactPage";
import RecentTransactionPage from "@/components/RecentTransactionPage";
import { Wallet, Users, Clock, Shield, Send } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export default function Home() {
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="w-72 h-72 bg-gradient-to-r from-zinc-200/30 to-zinc-300/30 dark:from-zinc-700/30 dark:to-zinc-600/30 rounded-full blur-3xl" />
          </motion.div>
          <div className="relative">
            {/* Logo */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.3,
              }}
            >
              <motion.div
                className="relative w-20 h-20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl transform rotate-45 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-zinc-200/50 dark:border-zinc-700/50"
                  animate={{
                    boxShadow: [
                      "0 8px 30px rgba(0,0,0,0.04)",
                      "0 8px 30px rgba(0,0,0,0.08)",
                      "0 8px 30px rgba(0,0,0,0.04)",
                    ],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <div className="relative">
                    <Shield className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
                    <Send className="w-4 h-4 text-zinc-600 dark:text-zinc-400 absolute -bottom-1 -right-1" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/50 dark:border-zinc-700/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] backdrop-blur-sm mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Shield className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Secure & Instant Payments
              </span>
            </motion.div>
            <motion.h1
              className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-600 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-400 mb-4 drop-shadow-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Pay to the Known One's
            </motion.h1>
            <motion.p
              className="text-zinc-500 dark:text-zinc-400 max-w-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Select a contact from your list to start sending SOL instantly.
              Your trusted network is just a click away.
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Payment Card and Transactions */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <motion.div
                className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Wallet className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Send Payment
                  </h2>
                </div>
                <Card02 />
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Recent Transactions
                  </h2>
                </div>
                <RecentTransactionPage />
              </motion.div>
            </motion.div>

            {/* Right Column - Contacts */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <motion.div
                className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Add New Contact
                  </h2>
                </div>
                <ContactAddition />
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-white/80 to-white/50 dark:from-zinc-900/80 dark:to-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center shadow-inner"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    All Contacts
                  </h2>
                </div>
                <GetAllContactPage />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
