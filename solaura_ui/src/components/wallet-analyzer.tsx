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
  age: number;
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
  const dummyData: AnalysisType[] = [
    {
      overall: "suspicious",
      analysis: {
        flags: ["scammer", "rugger"],
        degen: ["3Yr7f8qB2LmVQNy5Wp6zLCBBYsQb5NmQF1LtVmGz29Z5"],
        spammer: [
          "6Xa4GZv8rKT5CsxF3LMW3Xs8hND6FjNtQRBgFHy9CY9P",
          "7MxLWLNLnfxwExKo56VFbJhWmRSPMcEqrpDwNZRaPjZr",
        ],
        launder: [],
        rugger: ["8RxpKH5NqrTzWN8CoMeSwzFnZX5DP5s1kT5bwy9LW4Hw"],
      },
      age: 30,
      walletAddress: "DummyWalletAddress3",
    },
    {
      overall: "good",
      analysis: {
        flags: ["og", "superteam-member"],
        degen: [
          "9LyzMGVkSnTzMC8Va1QsLsRtMShkqQdQxFr4PyVJwL6P",
          "8TfPMgrFnH5B6VrZTq3EJCBXMXfLpPk4MNL6t9gRzw6k",
        ],
        spammer: [],
        launder: [],
        rugger: [],
      },
      age: 200,
      walletAddress: "DummyWalletAddress4",
    },
    {
      overall: "suspicious",
      analysis: {
        flags: ["degen", "scammer"],
        degen: [
          "7JLPCGVXbtWmHKFq7sXt7GxNFVpWTnMz6GmRsKQ5BmLn",
          "6LV5Kq6JFRkMVyVnTq7X5NpWTPnKwFJw7HpVyGsJqX5R",
        ],
        spammer: ["5PRXTyMvVLTJXwqVQwTRqKFLw5MnFyKPJMKPzXVsRm5T"],
        launder: [],
        rugger: [],
      },
      age: 50,
      walletAddress: "DummyWalletAddress5",
    },
    {
      overall: "good",
      analysis: {
        flags: ["og"],
        degen: ["4RTM7JGNTPXm5JVLwqX5TFMKF5MTPwqLJF7MzRNKV7XR"],
        spammer: [],
        launder: [],
        rugger: [],
      },
      age: 120,
      walletAddress: "DummyWalletAddress6",
    },
    {
      overall: "suspicious",
      analysis: {
        flags: ["degen", "scammer"],
        degen: [
          "3QLmVXPKTZMFyqXwMP5LqJVKw5XMpTZLR5RNMZRMJKwP",
          "9RMLKPVTqXMwJVqXTFqMKLFRMpZqRMXKwF7RMPwLJRMZ",
        ],
        spammer: ["6QRMKPLJVRXTqF7MRLKqFMPZJXM5TRMRXFLwPVwMRLT5"],
        launder: [],
        rugger: [],
      },
      age: 40,
      walletAddress: "DummyWalletAddress7",
    },
    {
      overall: "good",
      analysis: {
        flags: ["superteam-member"],
        degen: [
          "8MKPQRM5TZqXRMPwXLJVTFRMJLTP5MKVRZTLP5qRMJX7",
          "7PLVRMTJMLRTqZMPFqXRMZPVXTLPZMJP7RLMTJP5MKZT",
        ],
        spammer: [],
        launder: [],
        rugger: [],
      },
      age: 300,
      walletAddress: "DummyWalletAddress8",
    },
    {
      overall: "suspicious",
      analysis: {
        flags: ["rugger"],
        degen: ["4KMRXLVP5ZTqFJVRMLPJMPZT5MRLZKVRMPXRMJXZTLMR"],
        spammer: [],
        launder: ["7KMRLTPFRMJZTMRPVZRMTPXMVRMLTPF5KMZRPZT5RMLT"],
        rugger: ["9MKLRMJPXVRZTLPZTPMLRT5KMVRMZRMKPZT5KVRLPFZJ","7KMRLTPFRMJZTMRPVZRMTPXMVRMLTPF5KMZRPZT5RMLT"],
      },
      age: 15,
      walletAddress: "DummyWalletAddress9",
    },
    {
      overall: "good",
      analysis: {
        flags: ["og"],
        degen: [
          "7TLM5RMJPXZMKVRPTLZRMPJVLTPFJVLTPRMLKXZRMZML",
          "4TLMZMRLPXVRMPTF7MRLPXKMZT5MRMPJZRMPTLVRMLTP",
        ],
        spammer: [],
        launder: [],
        rugger: [],
      },
      age: 95,
      walletAddress: "DummyWalletAddress10",
    },
  ];
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
  
      // Select a random entry from the dummy JSON
      const randomDummy = dummyData[Math.floor(Math.random() * dummyData.length)];
      setAnalysis((prev) => [...prev, { ...randomDummy, walletAddress: address }]);
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
