"use client";
import { useRouter } from "next/navigation";
import { authClient } from "./auth-client";
import { useEffect } from "react";

export function AuthCheck() {
  const session = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.user) {
      router.push("/dashboard");
    }
  }, [session]);
  return null;
}
