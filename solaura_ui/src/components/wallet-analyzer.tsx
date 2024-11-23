"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
type AnalysisType = {
  reputation: string;
  score: number;
  activities: string[];
  flags: string[];
} | null;
export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisType>(null); // Set initial state to null
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAnalysis({
      reputation: "Good",
      score: 85,
      activities: [
        "NFT purchases",
        "DeFi interactions",
        "Regular transactions",
      ],
      flags: ["None"],
    }); // Now this is typed correctly
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-800 text-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Solana Wallet Reputation Analyzer
        </h1>
        <p className="text-xl opacity-80">
          Unlock insights and build trust in the Solana ecosystem
        </p>
      </header>

      <main className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Solana wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/50 flex-grow"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-purple-700 hover:bg-white/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Wallet Analysis</CardTitle>
                  <CardDescription className="text-white/70">
                    Results based on past activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Reputation:</span>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {analysis.reputation}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Trust Score:</span>
                      <span className="text-2xl font-bold">
                        {analysis.score}/100
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">Recent Activities:</h3>
                      <ul className="list-disc list-inside">
                        {analysis.activities.map((activity, index) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">Flags:</h3>
                      <ul className="list-disc list-inside">
                        {analysis.flags.map((flag, index) => (
                          <li key={index}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
