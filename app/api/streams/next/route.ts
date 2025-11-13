import prisma from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 403 });
  }

  const mostUpvotedStream = await prisma.stream.findFirst({
    where: {
      userId: user.id,
      played: false,
    },
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  if (!mostUpvotedStream) {
    return NextResponse.json({
      message: "No unplayed streams left.",
    });
  }

  const current = await prisma.currentStream.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      stream: true,
    },
  });

  await Promise.all([
    prisma.currentStream.upsert({
      where: { userId: user.id },
      update: {
        streamId: mostUpvotedStream.id,
      },
      create: {
        userId: user.id,
        streamId: mostUpvotedStream.id,
      },
    }),
    prisma.stream.update({
      where: { id: mostUpvotedStream.id },
      data: {
        played: true,
        playedTs: new Date(),
      },
    }),
  ]);

  if (current?.streamId) {
    await prisma.stream.delete({
      where: {
        id: current.streamId,
      },
    });
  }

  return NextResponse.json({
    stream: mostUpvotedStream,
  });
}
