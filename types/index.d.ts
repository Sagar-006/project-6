interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
  spaceId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  // relations omitted for simplification
}

interface Upvote {
  id: string;
  userId: string;
  streamId: string;
  user?: User;
  // other fields if needed
}

interface Stream {
  id: string;
  type: "Youtube" | "Spotify";
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  played: boolean;
  playedTs?: string | Date | null;
  createAt: string | Date;
  userId: string;
  addedById: string;
  user?: User;
  addedBy?: User;
  currentStream?: CurrentStream | null;
  upvotes: Upvote[];
}

// For _count select (aggregate) fields from Prisma
interface StreamCount {
  upvotes: number;
}

// Extend Stream for the `include` results:
interface StreamWithCount extends Stream {
  _count: StreamCount;
}

