import { IMatch } from "@/backend/models/match.model";
import { TeamScore } from "./team-score";

interface ScoreboardProps {
  match: IMatch;
}

export function Scoreboard({ match }: ScoreboardProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-12 items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/20 shadow-2xl ring-1 ring-black/5 relative z-10">
      <TeamScore
        name={match.team1.name}
        score={match.team1.score}
        wickets={match.team1.wickets}
        sport={match.sport}
        alignment="left"
        colorClass="bg-primary"
      />

      <div className="flex flex-col items-center justify-center space-y-2">
        <span className="text-5xl md:text-6xl font-black text-slate-200 dark:text-slate-800 select-none italic font-serif opacity-50">
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
    </div>
  );
}
