"use client";

import { Comments } from "@/components/comments";
import { MatchHeader } from "@/components/match/match-header";
import { Scoreboard } from "@/components/match/scoreboard";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { Trophy } from "lucide-react";
import { useParams } from "next/navigation";

export default function PublicMatch() {
  const { id } = useParams<{ id: string }>();
  // Use a shorter refetch interval for "live" feel without web sockets yet
  const { useMatchQuery } = useMatchAction();
  const { data: match, isLoading } = useMatchQuery(id, 2000);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse">
            Loading match data...
          </p>
        </div>
      </div>
    );

  if (!match)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Match not found</h1>
          <p className="text-muted-foreground">
            The match you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950/50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12 relative z-10">
        <div className="grid gap-6">
          {/* Header matches grid width */}
          <MatchHeader
            title={match.title}
            sport={match.sport}
            status={match.status}
          />

          {/* Scoreboard consumes main area */}
          <Scoreboard match={match} />

          {/* Comments in their own section */}
          <div className="mt-8 max-w-3xl mx-auto w-full">
            <Comments matchId={id} />
            <div className="mt-12 text-center">
              <p className="text-xs text-muted-foreground font-semibold tracking-wider uppercase opacity-70">
                Powered by Score Tracker
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
