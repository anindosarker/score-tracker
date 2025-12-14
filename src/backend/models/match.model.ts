import mongoose, { Document, Schema } from "mongoose";

export interface IMatch extends Document {
  title: string;
  team1: { name: string; score: number };
  team2: { name: string; score: number };
  status: "LIVE" | "FINISHED";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    title: { type: String, required: true },
    team1: {
      name: { type: String, required: true },
      score: { type: Number, default: 0 },
    },
    team2: {
      name: { type: String, required: true },
      score: { type: Number, default: 0 },
    },
    status: { type: String, enum: ["LIVE", "FINISHED"], default: "LIVE" },
    createdBy: { type: String, required: true }, // Store User ID
  },
  { timestamps: true }
);

export default mongoose.models.Match ||
  mongoose.model<IMatch>("Match", MatchSchema);
