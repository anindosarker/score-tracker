import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase truncate max-w-[240px]">
          {name}
        </h2>
        {/* Removed the separate pill div, handling color via top border on parent Card */}
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <span className="text-9xl font-black tabular-nums tracking-tighter leading-none text-foreground drop-shadow-sm">
          {score}
        </span>
        {sport === "CRICKET" && (
          <Badge
            variant="outline"
            className="mt-4 px-3 py-1 text-xs font-medium bg-secondary/50"
          >
            {wickets || 0} Wickets
          </Badge>
        )}
      </div>
    </div>
  );
}
