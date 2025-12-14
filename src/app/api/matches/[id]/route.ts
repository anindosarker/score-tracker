import { matchService } from "@/backend/services/match.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const match = await matchService.getMatch(id);

  if (!match) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(match);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = (await params).id;
  const body = await request.json();

  try {
    const match = await matchService.updateScore(id, session.user.id, body);
    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized or Not Found" },
      { status: 403 }
    );
  }
}
