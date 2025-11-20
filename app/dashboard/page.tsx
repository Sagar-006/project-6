export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "../lib/session";
import StreamView from "@/components/StreamView";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }

  const creatorId = session.user.id;
  console.log("this is Creator Id", creatorId);

  return (
    <div className=" bg-white text-black dark:bg-black dark:text-white h-full w-full ">
      <div className="flex justify-end mx-32 pt-4"></div>
      <StreamView creatorId={creatorId} playVideo={true} />
    </div>
  );
}
