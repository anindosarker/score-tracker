"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMatchAction } from "@/hooks/actions/useMatchAction";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const { data: session } = authClient.useSession();
  const { useMatchesQuery, createMatchMutation } = useMatchAction();
  const { data: matches, isLoading } = useMatchesQuery();

  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("FOOTBALL");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const handleCreate = () => {
    createMatchMutation.mutate(
      {
        title,
        sport,
        team1: { name: team1 },
        team2: { name: team2 },
      },
      {
        onSuccess: () => {
          setTitle("");
          setTeam1("");
          setTeam2("");
        },
      }
    );
  };

  if (isLoading) return <div className="p-8">Loading matches...</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Match Title (e.g., Finals)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRICKET">Cricket</SelectItem>
                <SelectItem value="FOOTBALL">Football</SelectItem>
                <SelectItem value="BASKETBALL">Basketball</SelectItem>
                <SelectItem value="HANDBALL">Handball</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Team 1 Name"
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
            />
            <Input
              placeholder="Team 2 Name"
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={createMatchMutation.isPending}
          >
            {createMatchMutation.isPending ? "Creating..." : "Create Match"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Matches</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {matches?.map((match: any) => (
            <Card key={match._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  {match.title}
                </CardTitle>
                <Badge variant="secondary">{match.sport}</Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">{match.team1.name}</p>
                    <p className="text-2xl font-mono">
                      {match.team1.score}
                      {match.sport === "CRICKET" && (
                        <span className="text-sm text-muted-foreground">
                          /{match.team1.wickets}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-muted-foreground font-bold">VS</span>
                  <div className="text-center">
                    <p className="font-bold text-lg">{match.team2.name}</p>
                    <p className="text-2xl font-mono">
                      {match.team2.score}
                      {match.sport === "CRICKET" && (
                        <span className="text-sm text-muted-foreground">
                          /{match.team2.wickets}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/match/${match._id}`}>Public View</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/match/${match._id}/manage`}>Manage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {matches?.length === 0 && (
            <p className="text-muted-foreground">No matches found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
