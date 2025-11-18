export const dynamic = "force-dynamic";

import db from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const UpvoteSchema = z.object({
  userId: z.string(),
  streamId: z.string(),
});
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  const user = session.user;

  try {
    const data = UpvoteSchema.parse(await req.json());

    if (!data.userId || !data.streamId) {
      return NextResponse.json(
        {
          message: "StreamId is missing",
        },
        {
          status: 403,
        }
      );
    }

    await db.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    return NextResponse.json({
      message: "Done!",
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while upvoting",
        error: e,
      },
      {
        status: 403,
      }
    );
  }
}
