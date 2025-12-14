import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface MatchHeaderProps {
  title: string;
  sport: string;
  status: string;
  onShare?: () => void;
}

export function MatchHeader({
  title,
  sport,
  status,
  onShare,
}: MatchHeaderProps) {
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out the score for ${title}`,
          url: url,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const isLive = status === "LIVE";

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 p-2 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="space-y-2 text-center md:text-left">
        <div className="flex items-center gap-2 justify-center md:justify-start">
          <Badge
            variant="outline"
            className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
          >
            {sport}
          </Badge>
          <span
            className={cn(
              "flex h-2 w-2 rounded-full",
              isLive ? "bg-red-500 animate-pulse" : "bg-slate-400"
            )}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {status}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground text-balance">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full shadow-sm hover:bg-secondary/80"
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-3.5 w-3.5" />
          Share Match
        </Button>
      </div>
    </div>
  );
}
