import { Document, Schema, model, models } from "mongoose";

export interface IComment extends Document {
  matchId: string;
  userId?: string; // Optional for guests
  guestName?: string; // Required if userId is missing
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    matchId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    guestName: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment =
  models.Comment || model<IComment>("Comment", CommentSchema);
