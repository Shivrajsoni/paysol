import Card02 from "@/@/components/xui/card-02";
import ContactAddition from "@/components/ContactAddition";
import GetAllContactPage from "@/components/GetAllContactPage";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-4">
            Solana Pay
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Send payments securely and instantly using Solana blockchain only to
            the known one's
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Payment Card */}
            <div className="w-full">
              <Card02 />
            </div>

            {/* Right Column - Info/Stats */}
            <div className="space-y-6">
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Add to Contact Info
                </h2>
                <div className="space-y-4">
                  <ContactAddition />
                </div>
              </div>

              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  All Contact's
                </h2>
                <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                  <GetAllContactPage />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
