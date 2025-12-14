import dbConnect from "@/backend/lib/db";
import { Comment } from "@/backend/models/comment.model";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter (for demonstration purposes, ideally use Redis)
const rateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 comments per minute

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const matchId = (await params).id;
  await dbConnect();

  const comments = await Comment.find({ matchId })
    .sort({ createdAt: -1 })
    .limit(50);

  // Enrich comments with user details if possible (in a real app, populate from User model)
  // For now, Better-Auth stores users separately. We might need to fetch names if we want avatars for auth users.
  // But guests store guestName directly.

  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const matchId = (await params).id;
  const ip = (await headers()).get("x-forwarded-for") || "unknown";

  // Rate Limiting
  const now = Date.now();
  const userRate = rateLimit.get(ip) || 0;
  if (userRate > now) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  // Reset window if passed, else just enforcing simple gap?
  // actually a simpler implementation:
  rateLimit.set(ip, now + RATE_LIMIT_WINDOW / MAX_REQUESTS); // spacing requests

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const body = await req.json();
  const { content, guestName } = body;

  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  if (!session && !guestName) {
    return NextResponse.json(
      { error: "Name required for guests" },
      { status: 400 }
    );
  }

  await dbConnect();

  const comment = await Comment.create({
    matchId,
    userId: session?.user.id,
    guestName: session?.user.name || guestName, // Use session name if avail, else guest name
    content,
  });

  return NextResponse.json(comment);
}
