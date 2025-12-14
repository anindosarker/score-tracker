import mongoose, { Document, Schema } from "mongoose";

export interface IMatch extends Document {
  title: string;
  sport: "CRICKET" | "FOOTBALL" | "BASKETBALL" | "HANDBALL";
  team1: { name: string; score: number; wickets?: number };
  team2: { name: string; score: number; wickets?: number };
  status: "LIVE" | "FINISHED";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    title: { type: String, required: true },
    sport: {
      type: String,
      enum: ["CRICKET", "FOOTBALL", "BASKETBALL", "HANDBALL"],
      default: "FOOTBALL",
    },
    team1: {
      name: { type: String, required: true },
      score: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
    },
    team2: {
      name: { type: String, required: true },
      score: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
    },
    status: { type: String, enum: ["LIVE", "FINISHED"], default: "LIVE" },
    createdBy: { type: String, required: true }, // Store User ID
  },
  { timestamps: true }
);

export default mongoose.models.Match ||
  mongoose.model<IMatch>("Match", MatchSchema);
