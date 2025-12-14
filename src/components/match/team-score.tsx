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
    <div className="flex flex-col items-center space-y-6 group">
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase drop-shadow-sm px-2 truncate max-w-[200px] md:max-w-xs transition-colors group-hover:text-primary">
          {name}
        </h2>
        <div
          className={cn(
            "h-1.5 w-16 rounded-full mx-auto shadow-sm transition-all duration-500 group-hover:w-24 group-hover:shadow-primary/25",
            colorClass
          )}
        />
      </div>
      <div className="relative flex flex-col items-center justify-center p-8 bg-card/50 rounded-[2rem] shadow-inner border border-border/50 min-w-[160px] md:min-w-[200px] backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:bg-card hover:scale-105 hover:border-primary/20">
        <span className="text-8xl md:text-[9rem] font-black tabular-nums tracking-tighter leading-none text-foreground drop-shadow-xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {score}
        </span>
        {sport === "CRICKET" && (
          <Badge
            variant="secondary"
            className="mt-4 px-4 py-1 text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
          >
            {wickets || 0} Wickets
          </Badge>
        )}
      </div>
    </div>
  );
}
