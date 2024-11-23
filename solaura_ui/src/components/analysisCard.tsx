import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// @ts-ignore
import { ClipboardCopyIcon } from "@heroicons/react/outline"; // Add a copy icon (Heroicons or your preferred icon library)

type AnalysisType = {
  overall: string;
  analysis: {
    flags: string[];
    donor: string[];
    criminal: string[];
    [key: string]: string[];
  };
};

const flagStyles: { [key: string]: string } = {
  donor: "bg-green-100 text-green-800 border-green-300",
  criminal: "bg-red-100 text-red-800 border-red-300",
  insider: "bg-blue-100 text-blue-800 border-blue-300",
  jeeter: "bg-pink-100 text-pink-800 border-pink-300",
  rugger: "bg-orange-100 text-orange-800 border-orange-300",
  trader: "bg-purple-100 text-purple-800 border-purple-300",
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
  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).then(() => {
      alert("Wallet address copied to clipboard!"); // Optionally provide user feedback
    });
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
            className={`px-3 py-1 text-sm ${flagStyles[flag] || "bg-gray-100 text-gray-800 border-gray-300"}`}
          >
            {flag}
          </Badge>
        ))}
      </div>

      {/* Card Content */}
      <CardHeader>
        <CardTitle className="text-2xl">
          Wallet Analysis of
          <span className="ml-2 inline-flex items-center">
            <span className="font-mono">{walletAddress}</span>
            <ClipboardCopyIcon
              onClick={handleCopy}
              className="w-5 h-5 ml-2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            />
          </span>
        </CardTitle>
        <CardDescription className="text-white/70">
          Results based on past activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Overall Section */}
          <div className="flex justify-between items-center">
            <span className="text-lg">Overall:</span>
            <Badge
              variant="outline"
              className={`text-lg px-3 py-1 ${
                isDarkTheme ? "bg-gray-700 text-gray-300" : ""
              }`}
            >
              {analysis.overall}
            </Badge>
          </div>

          {/* Hashes Section */}
          {Object.keys(analysis.analysis).map((category) => {
            if (category === "flags") return null; // Skip the flags array
            return (
              <div key={category}>
                <h3 className="text-lg mb-2 capitalize">{category} Hashes:</h3>
                <ul className="list-disc list-inside">
                  {analysis.analysis[category].map((hash, index) => (
                    <li key={index}>{hash}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}