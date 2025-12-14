import { IMatch } from "@/backend/models/match.model";
import { Card, CardContent } from "@/components/ui/card";
import { TeamScore } from "./team-score";

interface ScoreboardProps {
  match: IMatch;
}

export function Scoreboard({ match }: ScoreboardProps) {
  return (
    <Card className="border-none bg-background/60 dark:bg-card/60 backdrop-blur-xl shadow-2xl relative z-10 overflow-hidden">
      <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-12 items-center p-8 md:p-12">
        <TeamScore
          name={match.team1.name}
          score={match.team1.score}
          wickets={match.team1.wickets}
          sport={match.sport}
          alignment="left"
          colorClass="bg-primary"
        />

        <div className="flex flex-col items-center justify-center space-y-2 relative">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
          <span className="text-5xl md:text-6xl font-black text-muted-foreground/10 select-none italic font-serif relative z-10">
            VS
          </span>
        </div>

        <TeamScore
          name={match.team2.name}
          score={match.team2.score}
          wickets={match.team2.wickets}
          sport={match.sport}
          alignment="right"
          colorClass="bg-blue-500"
        />
      </CardContent>
    </Card>
  );
}
