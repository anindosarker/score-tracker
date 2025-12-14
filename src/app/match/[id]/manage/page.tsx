"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  RefreshCw,
  StopCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

// --- Sub-components for better code organization ---

interface ScoreControlProps {
  sport: string;
  teamName: string;
  score: number;
  wickets?: number; // Optional, specific to cricket
  onUpdateScore: (change: number) => void;
  onUpdateWickets?: (change: number) => void;
}

const ScoreControl = ({
  sport,
  score,
  wickets,
  onUpdateScore,
  onUpdateWickets,
}: ScoreControlProps) => {
  if (sport === "CRICKET") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {[1, 4, 6].map((points) => (
            <Button
              key={points}
              onClick={() => onUpdateScore(points)}
              variant="outline"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full text-lg font-bold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-sm"
            >
              +{points}
            </Button>
          ))}
          <Button
            onClick={() => onUpdateScore(1)}
            variant="outline"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full text-lg font-bold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-sm"
          >
            +1
          </Button>
        </div>

        <div className="bg-muted/30 p-3 rounded-xl border border-dashed border-border flex justify-center items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Wickets
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onUpdateWickets?.(-1)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              disabled={!wickets}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center font-bold font-mono text-lg">
              {wickets || 0}
            </span>
            <Button
              onClick={() => onUpdateWickets?.(1)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={(wickets || 0) >= 10}
            >
              +W
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (sport === "BASKETBALL") {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {[1, 2, 3].map((points) => (
          <Button
            key={points}
            onClick={() => onUpdateScore(points)}
            variant="outline"
            className="h-12 w-12 rounded-lg text-lg font-bold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 shadow-sm"
          >
            +{points}
          </Button>
        ))}
        <Button
          onClick={() => onUpdateScore(-1)}
          variant="ghost"
          className="h-12 w-12 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          -1
        </Button>
      </div>
    );
  }

  // Generic Controls (Football, Handball, etc.)
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={() => onUpdateScore(-1)}
        className="h-12 w-12 rounded-full shadow-sm"
        variant="outline"
        size="icon"
      >
        <Minus className="h-5 w-5" />
      </Button>
      <Button
        onClick={() => onUpdateScore(1)}
        className="h-12 w-12 rounded-full shadow-md"
        size="icon"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default function ManageMatch() {
  const { id } = useParams<{ id: string }>();

  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const router = useRouter();
  const { useMatchQuery, updateMatchMutation } = useMatchAction();
  const { data: match, isLoading } = useMatchQuery(id);

  useEffect(() => {
    if (!isAuthPending && !session) {
      router.push("/");
    }
  }, [session, isAuthPending, router]);

  if (isAuthPending || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!match)
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-semibold">Match not found</h2>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );

  const handleScoreUpdate = (team: "team1" | "team2", change: number) => {
    const currentScore = match[team].score;
    const newScore = Math.max(0, currentScore + change);
    updateMatchMutation.mutate({
      id,
      data: {
        [team]: { ...match[team], score: newScore },
      },
    });
  };

  const handleWicketUpdate = (team: "team1" | "team2", change: number) => {
    const currentWickets = match[team].wickets || 0;
    const newWickets = Math.max(0, Math.min(10, currentWickets + change));
    updateMatchMutation.mutate({
      id,
      data: {
        [team]: { ...match[team], wickets: newWickets },
      },
    });
  };

  const toggleStatus = () => {
    const newStatus = match.status === "LIVE" ? "FINISHED" : "LIVE";
    updateMatchMutation.mutate(
      {
        id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(`Match marked as ${newStatus}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-2xl">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                match.status === "LIVE"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  match.status === "LIVE"
                    ? "bg-red-500 animate-pulse"
                    : "bg-slate-400"
                }`}
              />
              {match.status}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Main Score & Info Card */}
        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 ring-1 ring-black/5 overflow-hidden">
          {/* Decorative Top Bar */}
          <div
            className={`h-2 w-full ${
              match.status === "LIVE"
                ? "bg-red-500"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          />

          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8 space-y-2">
              <Badge
                variant="outline"
                className="text-xs font-mono text-muted-foreground border-dashed"
              >
                {match.sport}
              </Badge>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                {match.title}
              </h1>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start mb-8">
              {/* Team 1 Score */}
              <div className="text-center space-y-2">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider truncate px-1">
                  {match.team1.name}
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-5xl font-black tabular-nums tracking-tighter text-foreground">
                    {match.team1.score}
                  </p>
                  {match.sport === "CRICKET" && (
                    <Badge
                      variant="secondary"
                      className="mt-2 text-[10px] h-5 px-1.5"
                    >
                      {match.team1.wickets || 0} Wkts
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-xl font-black text-muted-foreground/30 pt-10">
                :
              </div>

              {/* Team 2 Score */}
              <div className="text-center space-y-2">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider truncate px-1">
                  {match.team2.name}
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-5xl font-black tabular-nums tracking-tighter text-foreground">
                    {match.team2.score}
                  </p>
                  {match.sport === "CRICKET" && (
                    <Badge
                      variant="secondary"
                      className="mt-2 text-[10px] h-5 px-1.5"
                    >
                      {match.team2.wickets || 0} Wkts
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Controls Grid */}
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-dashed border-slate-200 dark:border-slate-700 relative">
                <Badge
                  variant="secondary"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px]"
                >
                  {match.team1.name} Controls
                </Badge>
                <ScoreControl
                  sport={match.sport}
                  teamName={match.team1.name}
                  score={match.team1.score}
                  wickets={match.team1.wickets}
                  onUpdateScore={(c) => handleScoreUpdate("team1", c)}
                  onUpdateWickets={(c) => handleWicketUpdate("team1", c)}
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-dashed border-slate-200 dark:border-slate-700 relative">
                <Badge
                  variant="secondary"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px]"
                >
                  {match.team2.name} Controls
                </Badge>
                <ScoreControl
                  sport={match.sport}
                  teamName={match.team2.name}
                  score={match.team2.score}
                  wickets={match.team2.wickets}
                  onUpdateScore={(c) => handleScoreUpdate("team2", c)}
                  onUpdateWickets={(c) => handleWicketUpdate("team2", c)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Controls */}
        <div className="space-y-4">
          <Button
            size="lg"
            className={`w-full font-bold h-14 text-base shadow-lg transition-all ${
              match.status === "LIVE"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                : "bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200"
            }`}
            onClick={toggleStatus}
          >
            {match.status === "LIVE" ? (
              <>
                <StopCircle className="mr-2 h-5 w-5" /> End Match
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" /> Restart Match
              </>
            )}
          </Button>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div
              className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-dashed shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              onClick={() => {
                const url = window.location.origin + "/match/" + id;
                navigator.clipboard.writeText(url);
                toast.success("Copied to clipboard");
              }}
            >
              <div className="h-10 w-10 bg-muted/50 rounded-lg flex items-center justify-center group-hover:bg-background transition-colors">
                <Copy className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Share Link
                </p>
                <p className="text-xs font-mono truncate text-foreground/80">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/match/${id}`
                    : "..."}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-full px-6 flex-col gap-1 border-dashed hover:border-solid hover:bg-secondary/50"
              asChild
            >
              <Link href={`/match/${match._id}`} target="_blank">
                <ExternalLink className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase">View</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
