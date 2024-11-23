import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AnalysisType = {
  reputation: string;
  score: number;
  activities: string[];
  flags: string[];
};

export default function AnalysisCard({
  analysis,
  isDarkTheme,
}: {
  analysis: AnalysisType;
  isDarkTheme: boolean;
}) {
  return (
    <Card
      className={`${
        isDarkTheme
          ? "bg-gray-800 border-gray-700"
          : "bg-white/10 border-white/20"
      }`}
    >
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
            <Badge
              variant="outline"
              className={`text-lg px-3 py-1 ${
                isDarkTheme ? "bg-gray-700 text-gray-300" : ""
              }`}
            >
              {analysis.reputation}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg">Trust Score:</span>
            <span className="text-2xl font-bold">{analysis.score}/100</span>
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
  );
}