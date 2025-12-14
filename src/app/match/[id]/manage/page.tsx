"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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

  if (isAuthPending || isLoading) return <div className="p-8">Loading...</div>;
  if (!match) return <div className="p-8">Match not found</div>;

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
    updateMatchMutation.mutate({
      id,
      data: { status: newStatus },
    });
  };

  const renderScoreControls = (team: "team1" | "team2") => {
    if (match.sport === "CRICKET") {
      return (
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <Button onClick={() => handleScoreUpdate(team, 1)} size="sm">
              +1
            </Button>
            <Button onClick={() => handleScoreUpdate(team, 4)} size="sm">
              +4
            </Button>
            <Button onClick={() => handleScoreUpdate(team, 6)} size="sm">
              +6
            </Button>
          </div>
          <div className="flex justify-center gap-2 items-center">
            <span className="text-sm font-semibold">
              Wickets: {match[team].wickets || 0}
            </span>
            <Button
              onClick={() => handleWicketUpdate(team, 1)}
              size="sm"
              variant="destructive"
              disabled={(match[team].wickets || 0) >= 10}
            >
              +W
            </Button>
            <Button
              onClick={() => handleWicketUpdate(team, -1)}
              size="sm"
              variant="outline"
              disabled={!match[team].wickets}
            >
              -W
            </Button>
          </div>
        </div>
      );
    }
    if (match.sport === "BASKETBALL") {
      return (
        <div className="flex justify-center gap-2">
          <Button onClick={() => handleScoreUpdate(team, 1)} size="sm">
            +1
          </Button>
          <Button onClick={() => handleScoreUpdate(team, 2)} size="sm">
            +2
          </Button>
          <Button onClick={() => handleScoreUpdate(team, 3)} size="sm">
            +3
          </Button>
          <Button
            onClick={() => handleScoreUpdate(team, -1)}
            size="sm"
            variant="outline"
          >
            -1
          </Button>
        </div>
      );
    }

    if (match.sport === "HANDBALL") {
      return (
        <div className="flex justify-center gap-2">
          <Button onClick={() => handleScoreUpdate(team, 1)} size="sm">
            +1
          </Button>
          <Button
            onClick={() => handleScoreUpdate(team, -1)}
            size="sm"
            variant="outline"
          >
            -1
          </Button>
        </div>
      );
    }

    // Default (Football, etc.)
    return (
      <div className="flex justify-center gap-2">
        <Button onClick={() => handleScoreUpdate(team, 1)} size="icon">
          +
        </Button>
        <Button
          onClick={() => handleScoreUpdate(team, -1)}
          variant="outline"
          size="icon"
        >
          -
        </Button>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Match</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">{match.title}</CardTitle>
          <div className="text-center space-y-2">
            <Badge variant="secondary">{match.sport}</Badge>
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  match.status === "LIVE"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                    : "bg-gray-100 text-gray-600 dark:bg-muted dark:text-muted-foreground"
                }`}
              >
                {match.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="text-center space-y-4 p-4 rounded-lg bg-muted/30">
              <h3 className="text-xl font-bold">{match.team1.name}</h3>
              <div className="flex flex-col items-center">
                <p className="text-6xl font-black tracking-tighter">
                  {match.team1.score}
                </p>
                {match.sport === "CRICKET" && (
                  <p className="text-xl text-muted-foreground font-medium">
                    / {match.team1.wickets || 0}
                  </p>
                )}
              </div>
              <div className="pt-2">{renderScoreControls("team1")}</div>
            </div>

            <div className="text-center space-y-4 p-4 rounded-lg bg-muted/30">
              <h3 className="text-xl font-bold">{match.team2.name}</h3>
              <div className="flex flex-col items-center">
                <p className="text-6xl font-black tracking-tighter">
                  {match.team2.score}
                </p>
                {match.sport === "CRICKET" && (
                  <p className="text-xl text-muted-foreground font-medium">
                    / {match.team2.wickets || 0}
                  </p>
                )}
              </div>
              <div className="pt-2">{renderScoreControls("team2")}</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant={match.status === "LIVE" ? "destructive" : "default"}
              onClick={toggleStatus}
            >
              {match.status === "LIVE" ? "End Match" : "Restart Match"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Public Link:</p>
        <code className="bg-muted p-2 rounded block w-full overflow-auto">
          {window.location.origin}/match/{id}
        </code>
      </div>
    </div>
  );
}
