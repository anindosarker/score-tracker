import dbConnect from "../lib/db";
import Match, { IMatch } from "../models/match.model";

export class MatchService {
  async createMatch(data: Partial<IMatch>, userId: string) {
    await dbConnect();
    const match = await Match.create({ ...data, createdBy: userId });
    return match;
  }

  async getMatch(id: string) {
    await dbConnect();
    const match = await Match.findById(id);
    return match;
  }

  async updateScore(id: string, userId: string, data: Partial<IMatch>) {
    await dbConnect();
    const match = await Match.findOne({ _id: id, createdBy: userId });

    if (!match) {
      throw new Error("Match not found or unauthorized");
    }

    Object.assign(match, data);
    await match.save();
    return match;
  }

  async getAllMatches(userId: string) {
    await dbConnect();
    return Match.find({ createdBy: userId }).sort({ createdAt: -1 });
  }
}

export const matchService = new MatchService();
