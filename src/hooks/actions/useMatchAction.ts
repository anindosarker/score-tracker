"use client";

import { matchServiceFrontend } from "@/lib/services/match.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MATCH_KEYS = {
  all: ["matches"] as const,
  detail: (id: string) => ["matches", id] as const,
};

export function useMatchAction() {
  const queryClient = useQueryClient();

  const createMatchMutation = useMutation({
    mutationFn: matchServiceFrontend.createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCH_KEYS.all });
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      matchServiceFrontend.updateMatch(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: MATCH_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: MATCH_KEYS.all });
    },
  });

  const useMatchesQuery = () =>
    useQuery({
      queryKey: MATCH_KEYS.all,
      queryFn: matchServiceFrontend.getAllMatches,
    });

  const useMatchQuery = (id: string, refetchInterval: number | false = false) =>
    useQuery({
      queryKey: MATCH_KEYS.detail(id),
      queryFn: () => matchServiceFrontend.getMatch(id),
      refetchInterval,
    });

  return {
    createMatchMutation,
    updateMatchMutation,
    useMatchesQuery,
    useMatchQuery,
  };
}
