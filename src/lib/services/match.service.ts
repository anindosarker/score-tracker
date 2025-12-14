import { IMatch } from "@/backend/models/match.model";
import httpClient from "@/lib/utils/httpClient";
// Note: importing IMatch from backend model for type safety in frontend.
// Ideally should be in shared types but this works for now.

class MatchService {
  async createMatch(data: {
    title: string;
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
}

export const matchServiceFrontend = new MatchService();
