import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient;
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
