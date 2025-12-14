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
    <div className="mb-10 flex flex-col items-center text-center space-y-6">
      <Badge
        variant="secondary"
        className="px-4 py-1.5 text-sm font-semibold tracking-wide uppercase bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm"
      >
        {sport}
      </Badge>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all",
            isLive
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          )}
        >
          <span
            className={cn(
              "mr-2 h-2 w-2 rounded-full",
              isLive ? "bg-red-500 animate-pulse" : "bg-slate-500"
            )}
          />
          {status}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 rounded-full text-xs font-semibold bg-white/50 dark:bg-slate-900/50 backdrop-blur border-slate-200 dark:border-slate-800 hover:bg-white hover:dark:bg-slate-900"
          onClick={handleShare}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </div>
  );
}
