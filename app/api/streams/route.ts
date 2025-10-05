export const runtime = "nodejs";

import { getSession } from "@/app/lib/session";
import { YT_REGEX } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import youtubesearchapi from "youtube-search-api";
import yts from "yt-search";
import { authClient } from "@/app/lib/auth-client";
import db from "@/app/lib/db";

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
          message: "Inavalid youtube URL format",
        },
        {
          status: 400,
        }
      );
    }

    // const res = await youtubesearchapi.GetVideoDetails(videoId);
    const res = await yts({ videoId });
    console.log(res);

    if (!res) {
      return NextResponse.json({
        message: "No Response from Youtube-Api!",
      });
    }

    // Check if the user is not the creator
    if (user.id !== data.creatorId) {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

      const userRecentStreams = await db.stream.count({
        where: {
          userId: data.creatorId,
          // addedBy: user.id,
          createAt: {
            gte: tenMinutesAgo,
          },
        },
      });

      const duplicateSong = await db.stream.findFirst({
        where: {
          userId: data.creatorId,
          extractedId: videoId,
          createAt: {
            gte: tenMinutesAgo,
          },
        },
      });
      console.log("Reached duplicateSong check");

      if (duplicateSong) {
        return NextResponse.json(
          {
            message: "This song was already added in the last 10 minutes",
          },
          {
            status: 429,
          }
        );
      }

      const streamsLastTwoMinutes = await db.stream.count({
        where: {
          userId: data.creatorId,
          // addedBy: user.id,
          createAt: {
            gte: twoMinutesAgo,
          },
        },
      });

      if (streamsLastTwoMinutes >= 2) {
        return NextResponse.json(
          {
            message:
              "Rate limit exceeded:You can only add 2 songs per 2 minutes",
          },
          {
            status: 429,
          }
        );
      }

      if (userRecentStreams >= 5) {
        return NextResponse.json(
          {
            message:
              "Rate limit exceeded:You can only add 5 songs per 10 minutes",
          },
          {
            status: 429,
          }
        );
      }

      const thumbnails = res.thumbnail.thumnails;

      thumbnails.sort((a: { width: number }, b: { width: number }) =>
        a.width < b.width ? -1 : 1
      );

      const existingActiveStreams = await db.stream.count({
        where: {
          // spaceId: data.spaceId,
          played: false,
        },
      });

      if (existingActiveStreams >= MAX_QUEUE_LEN) {
        return NextResponse.json(
          {
            message: "Queue is full",
          },
          {
            status: 429,
          }
        );
      }

      console.log("Reached stream create");
      const stream = await db.stream.create({
        data: {
          userId: data.creatorId,
          // addedBy: user.id,
          url: data.url,
          extractedId: videoId,
          type: "Youtube",
          title: res.title ?? "can't find video",
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
      console.log("Reached end of POST handler");
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 500,
      }
    );
  }
}

// export async function GET(req: NextRequest) {
//   const spaceId = req.nextUrl.searchParams.get("spaceId");
//   const session = await getSession();
//   if (!session?.user.id) {
//     return NextResponse.json(
//       {
//         message: "Unauthenticated",
//       },
//       {
//         status: 403,
//       }
//     );
//   }
//   const user = session.user;

//   if (!spaceId) {
//     return NextResponse.json(
//       {
//         message: "Error",
//       },
//       {
//         status: 411,
//       }
//     );
//   }

//   const [space, activeStream] = await Promise.all([
//     db.space.findUnique({
//       where: {
//         id: spaceId,
//       },
//       include: {
//         streams: {
//           include: {
//             _count: {
//               select: {
//                 upvotes: true,
//               },
//             },
//             upvotes: {
//               where: {
//                 userId: session.user.id,
//               },
//             },
//           },
//           where: {
//             played: false,
//           },
//         },
//         _count: {
//           select: {
//             streams: true,
//           },
//         },
//       },
//     }),
//     db.currentStream.findFirst({
//       where: {
//         spaceId: spaceId,
//       },
//       include: {
//         stream: true,
//       },
//     }),
//   ]);

//   const hostId = space?.hostId;
//   const isCreator = session.user.id === hostId;

//   return NextResponse.json({
//     streams: space?.streams.map((_count, ...rest) => ({
//       ...rest,
//       upvotes: _count.upvotes,
//       // @ts-ignore
//       haveUpvoted: rest.upvotes.length ? true : false,
//     })),
//     activeStream,
//     hostId,
//     isCreator,
//     spaceName: space?.name,
//   });
// }

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const streams = await db.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    streams,
  });
}
