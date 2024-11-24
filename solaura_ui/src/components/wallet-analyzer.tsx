"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AnalysisCard from "./analysisCard"; 
import { useWallet } from "@solana/wallet-adapter-react";

type AnalysisType = {
  overall: string;
  analysis: {
    flags: string[];
    degen: string[];
    spammer: string[];
    launder: string[];
    rugger: string[];
    [key: string]: string[]; 
  };
  walletAddress: string;
};

export default function WalletAnalyzer() {
  const { publicKey } = useWallet(); 
  const [address, setAddress] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme(); 
  const isValidSolanaAddress = (address: string) => {
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/; 
    return base58Regex.test(address);
  };

  useEffect(() => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
    }
  }, [publicKey]);

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
      setAnalysis((prev) => [...prev, { ...data, walletAddress: address }]); 
    } catch (error) {
      console.error("Failed to fetch analysis:", error);

      const fallback: AnalysisType & { walletAddress: string } = {
        overall: "Suspicious",
        analysis: {
          flags: ["degen", "spammer", "launder", "rugger", "og"],
          degen: [
            "5Lp6rrQXPQkQmTvQrD13AVcEbN7hLu8rgbFrb2DF1m724bmiRkh9TSGaFKNUCVYN7SD5qEUwoZPcWu4JFvMFRwgw",
          ],
          spammer: [
            "3q2M38okq9aHqEyQxDL8MYSNk9ff3uKc4h3iCjpyhyGYjHyvMz1xucpbEzAuaYui1qUYmFqTMM9NkFt6pSJXjXY2",
          ],
          launder: [
          ],
          rugger:[]
        },
        walletAddress: address, 
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
          ? "bg-gradient-to-br from-gray-600 via-black to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-600 via-violet-400 to-indigo-800 text-white"
      }`}
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Solaura Wallet Analyzer</h1>
        <p className="text-xl opacity-80">
          Unlock insights and build trust in the Solana ecosystem
        </p>
      </header>

      <main className="w-full max-w-4xl mx-auto">
        {/* Form for analysis */}
        <div className="mb-4 text-center text-gray-300 text-sm">
          Enter any Solana wallet address to analyze its behavior:
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col gap-2">
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
                disabled={isLoading || !isValidSolanaAddress(address)}
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

            {/* Validation Message */}
            {!isValidSolanaAddress(address) && address.length > 0 && (
              <p className="text-red-500 text-sm">
                Please enter a valid Solana wallet address.
              </p>
            )}
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
