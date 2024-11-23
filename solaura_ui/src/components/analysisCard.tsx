import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// @ts-ignore
import { ClipboardCopyIcon, LinkIcon } from "@heroicons/react/outline"; // Add a copy icon (Heroicons or your preferred icon library)
import { address } from "framer-motion/client";

type AnalysisType = {
  overall: string;
  analysis: {
    flags: string[];
    donor: string[];
    criminal: string[];
    [key: string]: string[];
  };
};

const badgeStyles: { [key: string]: string } = {
  Good: "bg-green-500 text-white",
  Suspicious: "bg-orange-500 text-white",
  Neutral: "bg-gray-500 text-white",
};
const flagStyles: { [key: string]: string } = {
  donor: "bg-green-100 text-green-800 border-green-300",
  criminal: "bg-red-100 text-red-800 border-red-300",
  insider: "bg-blue-100 text-blue-800 border-blue-300",
  jeeter: "bg-pink-100 text-pink-800 border-pink-300",
  rugger: "bg-orange-100 text-orange-800 border-orange-300",
  trader: "bg-purple-100 text-purple-800 border-purple-300",
};
const getBadgeStyle = (flag: string) => {
  if (flag === "good") return badgeStyles.Good;
  if (flag === "suspicious") return badgeStyles.Suspicious;
  if (flag === "neutral") return badgeStyles.Neutral;
};
export default function AnalysisCard({
  analysis,
  walletAddress,
  isDarkTheme,
}: {
  analysis: AnalysisType;
  walletAddress: string;
  isDarkTheme: boolean;
}) {
  const explorerLink = (hash: string) => `https://solscan.io/tx/${hash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      alert("Wallet address copied to clipboard!"); // Optionally provide user feedback
    });
  };
  const handleMintNFT = () => {
    // Simulated wallet connection and NFT minting preparation logic
    alert("Minting NFT: Open wallet to sign transaction.");
  };

  const handleReportOnChain = () => {
    // Placeholder logic for reporting on chain
    alert("Reported on-chain (dummy functionality).");
  };

  const handleShareToTwitter = () => {
    const message =
      analysis.overall.toLowerCase() === "good"
        ? "This guy is legit! 🚀"
        : "ALERT! Suspicious wallet! 🚨";
  
    const shareText = `${message} Check out this wallet analysis by Solaura for ${"https://solscan.io/account/"+walletAddress} 🔍 #Solana #Solaura`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;
  
    window.open(shareUrl, "_blank");
  };
  return (
    <Card
      className={`relative ${
        isDarkTheme
          ? "bg-gray-800 border-gray-700"
          : "bg-white/10 border-white/20"
      }`}
    >
      {/* Flags Section */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-2">
        {analysis.analysis.flags.map((flag, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`px-3 py-1 text-sm ${
              flagStyles[flag] || "bg-gray-100 text-gray-800 border-gray-300"
            }`}
          >
            {flag}
          </Badge>
        ))}
      </div>

      {/* Card Content */}
      <CardHeader>
        <CardTitle className="text-2xl">Wallet Analysis of:</CardTitle>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-lg text-gray-300">
            {walletAddress}
          </span>
          <ClipboardCopyIcon
            onClick={() => handleCopy()}
            className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-300"
          />
        </div>
        <CardDescription className="text-white/70 mt-4">
          Results based on past activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Overall Section */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Overall:</span>
            <div
              className={`w-20 h-20 flex items-center justify-center rounded-md font-bold text-lg ${
                analysis.overall === "good"
                  ? badgeStyles.Good
                  : badgeStyles.Suspicious
              }`}
            >
              {analysis.overall.toUpperCase()}
            </div>
          </div>

          {/* Hashes Section */}

          {Object.entries(analysis.analysis).map(([key, hashes]) => {
            // Skip "flags" as it's not a hash type
            if (key === "flags") return null;

            return (
              <div key={key}>
                <h3 className="text-lg mb-2 capitalize">{key} TrX:</h3>
                <div className="flex flex-wrap gap-2">
                  {hashes.map((hash, index) => (
                    <Badge
                      key={index}
                      className={`flex items-center gap-2 px-3 py-2 ${
                        flagStyles[key] ||
                        "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      <a
                        href={explorerLink(hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center"
                      >
                        <LinkIcon className="w-4 h-4 inline mr-1" />
                        {
                          hash
                        }
                      </a>
                      <ClipboardCopyIcon
                        onClick={() => handleCopy()}
                        className="w-4 h-4 cursor-pointer hover:text-opacity-80"
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={handleMintNFT}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Mint NFT from this Analysis
          </button>
          <button
            onClick={handleReportOnChain}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Report on Chain
          </button>
          <button
            onClick={handleShareToTwitter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Share to Twitter
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
