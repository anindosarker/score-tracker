"use client";

import { IMatch } from "@/backend/models/match.model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowRight, Plus, Trophy } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-10 p-6 lg:p-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your matches and create new ones.
        </p>
      </div>

      <Card className="border-dashed border-2 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Create New Match
          </CardTitle>
          <CardDescription>
            Start tracking a new game instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <Input
              placeholder="Match Title (e.g., Summer Cup Finals)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger className="h-10">
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
            className="w-full md:w-auto"
          >
            {createMatchMutation.isPending ? "Creating..." : "Create Match"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Your Matches</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches?.map((match: IMatch) => (
            <Card
              key={match._id as unknown as string}
              className="group relative overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs font-normal"
                  >
                    {match.sport}
                  </Badge>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      match.status === "LIVE"
                        ? "bg-red-500 animate-pulse"
                        : "bg-muted"
                    }`}
                  />
                </div>
                <CardTitle className="line-clamp-1 text-lg font-bold tracking-tight relative z-10">
                  {match.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-3">
                  <div className="text-center min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {match.team1.name}
                    </p>
                    <p className="text-2xl font-black">
                      {match.team1.score}
                      {match.sport === "CRICKET" && (
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">
                          /{match.team1.wickets}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground/50">
                    VS
                  </div>
                  <div className="text-center min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-muted-foreground">
                      {match.team2.name}
                    </p>
                    <p className="text-2xl font-black">
                      {match.team2.score}
                      {match.sport === "CRICKET" && (
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">
                          /{match.team2.wickets}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    <Link href={`/match/${match._id}`}>
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/match/${match._id}/manage`}>Manage</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {matches?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center animate-in fade-in-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Trophy className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No matches yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create a match to start tracking scores.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
