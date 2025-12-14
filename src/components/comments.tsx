"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCommentAction } from "@/hooks/actions/useCommentAction";
import { authClient } from "@/lib/auth-client";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";

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
      alert("Please enter a name");
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
        },
      }
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments?.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              No comments yet. Be the first!
            </p>
          ) : (
            comments?.map((comment: any) => (
              <div key={comment._id} className="flex gap-3 items-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${
                      comment.userId
                        ? "user-" + comment.userId
                        : comment.guestName
                    }`}
                  />
                  <AvatarFallback>
                    {(comment.guestName || "U")[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold">
                      {comment.guestName || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-foreground/90 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!session && (
            <Input
              placeholder="Your Name (Guest)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="max-w-xs"
            />
          )}
          <div className="flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              type="submit"
              size="icon"
              disabled={postCommentMutation.isPending}
              className="self-end"
            >
              {postCommentMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
