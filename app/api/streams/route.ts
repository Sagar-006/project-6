import { getSession } from "@/app/lib/session";
import { YT_REGEX } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as youtubesearchapi from "youtube-search-api";
import db from "@/app/lib/db";
import prisma from "@/app/lib/db";

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
  // spaceId: z.string(),
});

const MAX_QUEUE_LEN = 20;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    console.log(session);
    if (!session?.user.id) {
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

    const data = CreateStreamSchema.parse(await req.json());

    if (!data.url.trim()) {
      return NextResponse.json(
        {
          message: "Youtube link cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    const isYt = data.url.match(YT_REGEX);
    const videoId = data.url ? data.url.match(YT_REGEX)?.[1] : null;

    if (!isYt || !videoId) {
      return NextResponse.json(
        {
          message: "Invalid youtube URL format",
        },
        {
          status: 400,
        }
      );
    }
    console.log("Video ID:", videoId);

    const checkVideoIsAlreadyExist = await db.stream.findFirst({
      where: {
        extractedId: videoId ?? "",
      },
    });

    if (checkVideoIsAlreadyExist) {
      return NextResponse.json(
        {
          message: "Video is Already In Stream!",
        },
        {
          status: 409,
        }
      );
    }

    const ytRes = await youtubesearchapi.GetVideoDetails(videoId);
    console.log("YT Response ", JSON.stringify(ytRes, null, 2));

    if (!ytRes || typeof ytRes !== "object") {
      return NextResponse.json(
        {
          message: "No valid Response received from Youtube-Api!",
        },
        { status: 500 }
      );
    }

    const thumbnails = ytRes.thumbnail.thumbnails;
    console.log(thumbnails);
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    console.log("Reached stream create");
    const stream = await db.stream.create({
      data: {
        userId: data.creatorId,
        addedById: user.id,
        url: data.url,
        extractedId: videoId,
        type: "Youtube",
        title: ytRes?.title ?? "can't find video",
        smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        bigImg:
          thumbnails[thumbnails.length - 1].url ??
          "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        // spaceId: data.spaceId,
      },
    });

    return NextResponse.json({
      ...stream,
      hasUpvoted: false,
      upvotes: 0,
    });
  } catch (e) {
    console.error("Full error:", e);
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : JSON.stringify(e),
        message: "Error while adding a stream",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const session = await getSession();
  const user = await db.user.findFirst({
    where: {
      email: session?.user.email ?? "",
    },
  });
  if (!creatorId) {
    return NextResponse.json({
      message: "Need creatorId!",
    });
  }
  const [streams, activeStream] = await Promise.all([
    await db.stream.findMany({
      where: {
        userId: creatorId,
        played: false,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: {
            userId: user?.id,
          },
        },
      },
    }),
    prisma.currentStream.findFirst({
      where: {
        userId: creatorId,
      },
      include: {
        stream: true,
      },
    }),
  ]);

  return NextResponse.json({
    streams: streams.map(
      ({
        _count,
        ...rest
      }: {
        _count: { upvotes: number };
        upvotes: any[];
        [key: string]: any;
      }) => ({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: rest.upvotes.length ? true : false,
      })
    ),
    activeStream,
  });
}
