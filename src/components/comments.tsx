"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCommentAction } from "@/hooks/actions/useCommentAction";
import { authClient } from "@/lib/auth-client";
import { IComment } from "@/lib/services/match.service";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CommentsProps {
  matchId: string;
}

export function Comments({ matchId }: CommentsProps) {
  const { useCommentsQuery, postCommentMutation } = useCommentAction(matchId);
  const { data: comments, isLoading } = useCommentsQuery();
  const { data: session } = authClient.useSession();

  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("guestName");
    if (storedName) {
      setGuestName(storedName);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!session && !guestName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (!session && guestName) {
      localStorage.setItem("guestName", guestName);
    }

    postCommentMutation.mutate(
      { content, guestName: session ? undefined : guestName },
      {
        onSuccess: () => {
          setContent("");
          toast.success("Comment posted!");
        },
      }
    );
  };

  return (
    <Card className="mt-6 border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="h-5 w-5" />
          Live Comments {comments?.length ? `(${comments.length})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-8 bg-card p-4 rounded-xl border shadow-sm"
        >
          {!session && (
            <Input
              placeholder="Your Name (Guest)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="max-w-xs bg-background/50 border-transparent focus:border-primary hover:bg-background transition-colors"
            />
          )}
          <div className="relative">
            <Textarea
              placeholder="Cheer for your team..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] bg-background/50 border-transparent focus:border-primary hover:bg-background transition-colors resize-none pr-12"
            />
            <Button
              type="submit"
              size="icon"
              disabled={postCommentMutation.isPending}
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
            >
              {postCommentMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/30" />
            </div>
          ) : comments?.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-dashed text-muted-foreground bg-muted/20">
              <p>No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments?.map((comment: IComment) => (
              <div
                key={comment._id}
                className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${
                      comment.userId
                        ? "user-" + comment.userId
                        : comment.guestName
                    }`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(comment.guestName || "U")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm tracking-tight">
                      {comment.guestName || "User"}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/60">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="bg-card px-4 py-3 rounded-2xl rounded-tl-none border shadow-sm text-sm leading-relaxed text-foreground/90">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
