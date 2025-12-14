"use client";

import { matchServiceFrontend } from "@/lib/services/match.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const COMMENT_KEYS = {
  detail: (matchId: string) => ["comments", matchId] as const,
};

export function useCommentAction(matchId: string) {
  const queryClient = useQueryClient();

  const useCommentsQuery = () =>
    useQuery({
      queryKey: COMMENT_KEYS.detail(matchId),
      queryFn: () => matchServiceFrontend.getComments(matchId),
    });

  const postCommentMutation = useMutation({
    mutationFn: (data: { content: string; guestName?: string }) =>
      matchServiceFrontend.postComment(matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_KEYS.detail(matchId) });
    },
  });

  return {
    useCommentsQuery,
    postCommentMutation,
  };
}
