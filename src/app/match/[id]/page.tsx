"use client";

import { Comments } from "@/components/comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { Share2 } from "lucide-react";
import { useParams } from "next/navigation";
// Actually shadcn doesn't install sonner by default usually, so I'll use a simple copy feedback or install sonner if needed.
// For now, simple Alert or browser API.

export default function PublicMatch() {
  const { id } = useParams<{ id: string }>();
  const { useMatchQuery } = useMatchAction();
  const { data: match, isLoading } = useMatchQuery(id, 2000);

  const handleShare = async () => {
    const url = window.location.href;
    if (!match) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: match.title,
          text: `Check out the score for ${match.title}`,
          url: url,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      // Ideally show a toast here. standard browser alert is ugly but functional for now.
      // Or change button text temporarily.
      alert("Link copied to clipboard!");
    }
  };

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
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center border-b pb-6 relative">
          <Badge variant="outline" className="mb-2">
            {match.sport}
          </Badge>
          <CardTitle className="text-4xl font-bold mb-2">
            {match.title}
          </CardTitle>
          <div>
            <span
              className={`px-4 py-1 rounded-full text-base font-bold tracking-wider ${
                match.status === "LIVE"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-600 dark:bg-muted dark:text-muted-foreground"
              }`}
            >
              {match.status}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-items-center">
            <div className="text-center w-full p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/10 border shadow-sm">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {match.team1.name}
              </h3>
              <div className="flex flex-col items-center justify-center min-h-[120px]">
                <span className="text-7xl md:text-8xl font-black tabular-nums tracking-tighter leading-none">
                  {match.team1.score}
                </span>
                {match.sport === "CRICKET" && (
                  <span className="text-2xl text-muted-foreground font-bold mt-1">
                    / {match.team1.wickets || 0}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden md:block text-2xl font-black text-muted-foreground/20">
              VS
            </div>

            <div className="text-center w-full p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/10 border shadow-sm">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {match.team2.name}
              </h3>
              <div className="flex flex-col items-center justify-center min-h-[120px]">
                <span className="text-7xl md:text-8xl font-black tabular-nums tracking-tighter leading-none">
                  {match.team2.score}
                </span>
                {match.sport === "CRICKET" && (
                  <span className="text-2xl text-muted-foreground font-bold mt-1">
                    / {match.team2.wickets || 0}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Comments matchId={id} />

      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground">
        Live updates enabled
      </div>
    </div>
  );
}
