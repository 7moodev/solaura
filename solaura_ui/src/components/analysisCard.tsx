import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { XIcon } from "lucide-react";
// @ts-ignore
import { ClipboardCopyIcon, LinkIcon } from "@heroicons/react/outline";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";

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

const badgeStyles: { [key: string]: string } = {
  Good: "bg-green-500 text-white",
  Suspicious: "bg-red-500 text-white",
  Neutral: "bg-gray-500 text-white",
};
const flagStyles: { [key: string]: string } = {
  degen: "bg-green-100 text-green-800 border-green-300",
  spammer: "bg-red-100 text-red-800 border-red-300",
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
  const tokenAddress = new PublicKey(
    "6xy719wtR9vjumsLUxEH3SXKQAGfVtuFdZBf4XTeWck3"
  );

  const explorerLink = (hash: string) => `https://solscan.io/tx/${hash}`;
  const { publicKey, signTransaction } = useWallet();
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string }>({
    visible: false,
    text: "",
  });

  const showTooltip = (text: string) => setTooltip({ visible: true, text });
  const hideTooltip = () => setTooltip({ visible: false, text: "" });

  const isSuperteam = analysis.analysis.flags.includes("superteam-member");

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      alert("Wallet address copied to clipboard!");
    });
  };

  const handleMintNFT = async () => {
    if (!publicKey || !signTransaction) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      // Establish connection to the Solana blockchain
      const connection = new Connection(
        "https://api.testnet.solana.com",
        "confirmed"
      );
      // Create a transaction to transfer a token (NFT)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: tokenAddress,
          lamports: 100000000, // Example: Sending 0.001 SOL
        })
      );
      // Set recent blockhash and fee payer
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.feePayer = publicKey;
      // Request the wallet to sign the transaction
      const signedTransaction = await signTransaction(transaction);
      // Send the signed transaction to the blockchain
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm the transaction
      await connection.confirmTransaction(signature, "confirmed");
      alert(`NFT Minted! Transaction Signature: ${signature}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Please try again.");
    }
  };

  const handleShareToTwitter = () => {
    let message =
      analysis.overall.toLowerCase() === "good"
        ? "This guy is legit! 🚀"
        : "ALERT! Suspicious wallet! 🚨";
    if (isSuperteam) {
      message = "Superteam Wallet! 🦸";
    }
    const shareText = `${message} Check out this wallet analysis by Solaura for ${
      "https://solscan.io/account/" + walletAddress
    } 🔍 #Solana #Solaura`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}`;

    window.open(shareUrl, "_blank");
  };

  return (
    <Card
      className={`relative transition-all ${
        isSuperteam
          ? "border-[5px] border-yellow-600 bg-gradient-to-r from-yellow-300 via-yellow-250 to-yellow-300 shadow-lg animate-pulse"
          : isDarkTheme
          ? "bg-gray-800 border-gray-700"
          : "bg-white/10 border-white/20"
      }`}
    >
      {/* Superteam Badge */}
      {isSuperteam && (
        <div className="absolute -top-5 -right-9 bg-yellow-400 text-black px-3 py-1 text-sm rounded-md font-bold shadow-md">
          Superteam Member, {analysis.age} days wallet
        </div>
      )}

      {/* Overall Section */}
      {isSuperteam ? (
        <div></div>
      ) : (
        <div className="flex justify-between items-center">
          <div
            className={`w-40 h-18 flex items-center justify-center rounded-lg font-bold text-lg ${
              analysis.overall === "good"
                ? badgeStyles.Good
                : badgeStyles.Suspicious
            }`}
          >
            {analysis.overall.toUpperCase()}
          </div>
        </div>
      )}

      {/* Flags Section */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-2 items-center">
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
        {/* Wallet Age Badge */}
  
        {!isSuperteam && (
          <div
  className={`absolute -top-9 -right-8 bg-yellow-400 text-black px-3 py-1 text-sm rounded-md font-bold shadow-md whitespace-nowrap ${
    isDarkTheme
      ? "bg-yellow-500 text-black"
      : "bg-yellow-100 text-yellow-800 border-yellow-300"
  }`}
>
  Wallet Age: {analysis.age} days
</div>
)}
</div>
      {/* Card Content */}
      <CardHeader>
        <CardTitle className="text-2xl">Wallet Analysis of:</CardTitle>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-lg text-gray-500">
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
          {/* Hashes Section */}
          {Object.entries(analysis.analysis).map(([key, hashes]) => {
  if (key === "flags" || hashes.length === 0) return null; // Skip empty arrays and "flags"

  return (
    <div key={key} className="mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg capitalize">{key} TRX:</h3>
          {/* Info Button */}
          {["degen", "spammer"].includes(key.toLowerCase()) && (
            <div
              className="relative"
              onMouseEnter={() =>
                showTooltip(
                  key.toLowerCase() === "degen"
                    ? "These are transactions deemed beneficial or trustworthy."
                    : "These are flagged as suspicious transactions."
                )
              }
              onMouseLeave={hideTooltip}
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-500 hover:text-gray-300 cursor-pointer" />
              {tooltip.visible && (
                <div className="absolute z-10 bg-gray-700 text-white text-sm px-3 py-1 rounded-md shadow-lg mt-1">
                  {tooltip.text}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
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
                className="hover:underline w-full flex items-center"
              >
                <LinkIcon className="w-4 h-4 inline mr-1" />
                {hash}
              </a>
              <ClipboardCopyIcon
                onClick={() => handleCopy()}
                className="w-4 h-4 cursor-pointer hover:text-opacity-80"
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
})}
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-end">
          <button
            onClick={() => handleMintNFT()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <ClipboardCopyIcon className="w-5 h-5" />
            Mint NFT from this Analysis
          </button>
          {analysis.overall.toLowerCase() !== "good" && (
            <button
              onClick={() => alert("Report functionality here!")}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              <ExclamationCircleIcon className="w-5 h-5" />
              Report on Chain
            </button>
          )}
          <button
            onClick={() => handleShareToTwitter()}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Share to
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
