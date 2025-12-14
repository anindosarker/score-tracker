"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ManageMatch() {
  const { id } = useParams<{ id: string }>();
  // @ts-ignore
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

  const toggleStatus = () => {
    const newStatus = match.status === "LIVE" ? "FINISHED" : "LIVE";
    updateMatchMutation.mutate({
      id,
      data: { status: newStatus },
    });
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
          <div className="text-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                match.status === "LIVE"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {match.status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">{match.team1.name}</h3>
              <p className="text-6xl font-black">{match.team1.score}</p>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => handleScoreUpdate("team1", -1)}
                  variant="outline"
                  size="icon"
                >
                  -
                </Button>
                <Button
                  onClick={() => handleScoreUpdate("team1", 1)}
                  size="icon"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">{match.team2.name}</h3>
              <p className="text-6xl font-black">{match.team2.score}</p>
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => handleScoreUpdate("team2", -1)}
                  variant="outline"
                  size="icon"
                >
                  -
                </Button>
                <Button
                  onClick={() => handleScoreUpdate("team2", 1)}
                  size="icon"
                >
                  +
                </Button>
              </div>
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
