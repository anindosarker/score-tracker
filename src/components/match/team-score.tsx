import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamScoreProps {
  name: string;
  score: number;
  wickets?: number;
  sport: string;
  alignment: "left" | "right";
  colorClass: string;
}

export function TeamScore({
  name,
  score,
  wickets,
  sport,
  alignment = "left",
  colorClass,
}: TeamScoreProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase drop-shadow-sm px-2 truncate max-w-[200px] md:max-w-xs">
          {name}
        </h2>
        <div
          className={cn(
            "h-1.5 w-16 rounded-full mx-auto shadow-sm",
            colorClass
          )}
        />
      </div>
      <div className="relative flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950 rounded-[2rem] shadow-inner border border-slate-100 dark:border-slate-800 min-w-[160px] md:min-w-[200px]">
        <span className="text-8xl md:text-[9rem] font-black tabular-nums tracking-tighter leading-none text-slate-900 dark:text-slate-50 drop-shadow-sm">
          {score}
        </span>
        {sport === "CRICKET" && (
          <Badge
            variant="secondary"
            className="mt-2 px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200"
          >
            {wickets || 0} Wickets
          </Badge>
        )}
      </div>
    </div>
  );
}
