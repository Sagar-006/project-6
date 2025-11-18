export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (e) {
    console.error("session error", e);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }
  return session;
}

export async function requireGuest() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }
  return session;
}
