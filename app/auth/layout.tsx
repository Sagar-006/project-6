import { redirect } from "next/navigation";
import { getSession } from "../lib/session";

export default async function authLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <div>{children}</div>
}