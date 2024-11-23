"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes"; // Import the theme hook
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AnalysisCard from "./analysisCard"; // Import the AnalysisCard component

type AnalysisType = {
  overall: string;
  analysis: {
    flags: string[];
    donor: string[];
    criminal: string[];
    [key: string]: string[]; // For dynamic categories
  };
  walletAddress: string;
};

export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme(); // Access the current theme

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!address) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/?wallet-address=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: AnalysisType = await response.json();
      setAnalysis((prev) => [...prev, { ...data, walletAddress: address }]); // Add walletAddress to each entry
    } catch (error) {
      console.error("Failed to fetch analysis:", error);

      // Add a dummy fallback entry
      const fallback: AnalysisType & { walletAddress: string } = {
        overall: "good",
        analysis: {
          flags: ["donor", "criminal", "insider", "jeeter"],
          donor: ["0x123abc"],
          criminal: ["0x456def"],
        },
        walletAddress: address, // Include the current address
      };
      setAnalysis((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const isDarkTheme = theme === "dark";

  return (
    <div
      className={`min-h-screen w-full p-8 ${
        isDarkTheme
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-800 text-white"
      }`}
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Solana Wallet Reputation Analyzer
        </h1>
        <p className="text-xl opacity-80">
          Unlock insights and build trust in the Solana ecosystem
        </p>
      </header>

      <main className="w-full max-w-4xl mx-auto">
        {/* Form for analysis */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Solana wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${
                isDarkTheme
                  ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                  : "bg-white/10 border-white/20 placeholder-white/50 text-white"
              } flex-grow`}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={`${
                isDarkTheme
                  ? "bg-gray-300 text-gray-900 hover:bg-gray-400"
                  : "bg-white text-purple-700 hover:bg-white/90"
              }`}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </form>

        {/* Render Analysis Cards */}
        <AnimatePresence>
          {analysis.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <AnalysisCard
                analysis={entry}
                walletAddress={entry.walletAddress}
                isDarkTheme={isDarkTheme}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    </div>
  );
}
