import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances of PrismaClient in development
  // This works because `global` is a node global object
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
