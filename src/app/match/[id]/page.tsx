"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { useParams } from "next/navigation";

export default function PublicMatch() {
  const { id } = useParams<{ id: string }>();
  const { useMatchQuery } = useMatchAction();
  // Enable polling every 2 seconds
  const { data: match, isLoading } = useMatchQuery(id, 2000);

  if (isLoading)
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        Loading match data...
      </div>
    );
  if (!match)
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        Match not found
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-4xl font-bold mb-2">
            {match.title}
          </CardTitle>
          <div>
            <span
              className={`px-4 py-1 rounded-full text-base font-bold tracking-wider ${
                match.status === "LIVE"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {match.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-12">
          <div className="flex justify-center items-center gap-4 md:gap-16">
            <div className="text-center flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
                {match.team1.name}
              </h3>
              <div className="text-7xl md:text-9xl font-black text-slate-900 bg-white border rounded-xl p-4 shadow-sm inline-block min-w-[140px]">
                {match.team1.score}
              </div>
            </div>

            <div className="text-2xl font-bold text-slate-300">VS</div>

            <div className="text-center flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
                {match.team2.name}
              </h3>
              <div className="text-7xl md:text-9xl font-black text-slate-900 bg-white border rounded-xl p-4 shadow-sm inline-block min-w-[140px]">
                {match.team2.score}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground">
        Live updates enabled
      </div>
    </div>
  );
}
