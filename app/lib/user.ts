import { authClient } from "./auth-client";

export function User() {
   authClient.useSession();

  return null;
}
