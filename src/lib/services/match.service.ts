import { IMatch } from "@/backend/models/match.model";
import httpClient from "@/lib/utils/httpClient";
// Note: importing IMatch from backend model for type safety in frontend.
// Ideally should be in shared types but this works for now.

export interface IComment {
  _id: string;
  matchId: string;
  userId?: string;
  guestName?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

class MatchService {
  async createMatch(data: {
    title: string;
    sport: string;
    team1: { name: string };
    team2: { name: string };
  }) {
    const res = await httpClient.post<IMatch>("/matches", data);
    return res.data;
  }

  async getAllMatches() {
    const res = await httpClient.get<IMatch[]>("/matches");
    return res.data;
  }

  async getMatch(id: string) {
    const res = await httpClient.get<IMatch>(`/matches/${id}`);
    return res.data;
  }

  async updateMatch(id: string, data: Partial<IMatch>) {
    const res = await httpClient.patch<IMatch>(`/matches/${id}`, data);
    return res.data;
  }

  async getComments(matchId: string) {
    const res = await httpClient.get<IComment[]>(
      `/matches/${matchId}/comments`
    );
    return res.data;
  }

  async postComment(
    matchId: string,
    data: { content: string; guestName?: string }
  ) {
    const res = await httpClient.post<IComment>(
      `/matches/${matchId}/comments`,
      data
    );
    return res.data;
  }
}

export const matchServiceFrontend = new MatchService();
