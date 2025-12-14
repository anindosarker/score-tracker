import { IMatch } from "@/backend/models/match.model";
import { Card, CardContent } from "@/components/ui/card";
import { TeamScore } from "./team-score";

interface ScoreboardProps {
  match: IMatch;
}

export function Scoreboard({ match }: ScoreboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
      {/* Team 1 Card */}
      <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden relative group hover:shadow-md transition-all h-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary transform origin-left transition-transform duration-500 scale-x-100" />
        <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center h-full">
          <TeamScore
            name={match.team1.name}
            score={match.team1.score}
            wickets={match.team1.wickets}
            sport={match.sport}
            alignment="left"
            colorClass="bg-primary"
          />
        </CardContent>
      </Card>

      {/* Team 2 Card */}
      <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm overflow-hidden relative group hover:shadow-md transition-all h-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left transition-transform duration-500 scale-x-100" />
        <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center h-full">
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

      {/* VS Badge - Absolute positioned center or separate block? 
          Let's make it a small floating badge between them visually 
      */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-background border shadow-sm z-20">
        <span className="text-xs font-bold text-muted-foreground">VS</span>
      </div>
    </div>
  );
}
