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
    <div className="mb-10 flex flex-col items-center text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <Badge
        variant="secondary"
        className="px-4 py-1.5 text-sm font-semibold tracking-wide uppercase bg-background/50 backdrop-blur shadow-sm border border-border/50"
      >
        {sport}
      </Badge>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm text-balance">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all border",
            isLive
              ? "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          <span
            className={cn(
              "mr-2 h-2 w-2 rounded-full",
              isLive
                ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                : "bg-slate-400"
            )}
          />
          {status}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 rounded-full text-xs font-semibold backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
          onClick={handleShare}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </div>
  );
}
