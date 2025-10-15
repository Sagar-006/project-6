import { redirect } from "next/navigation";
import { getSession, requireAuth } from "../lib/session";
import AddSongForm from "@/components/StreamView/AddSongForm";
import StreamView from "@/components/StreamView";
import { Logout } from "@/components/Logout";
import { LogOut } from "lucide-react";

export default async function Dashboard(){
  const session = await getSession();
  if(!session){
    redirect("/auth/signup")
  }

  const creatorId =  session.user.id;
  // console.log(userId)

  return (
    <div className="bg-black h-full w-full ">
      <div className="flex justify-end mx-32 pt-4">
        {/* <h1>Welcome {session?.user.name} </h1> */}
        {creatorId && (
          <Logout>
            <LogOut className="text-white cursor-pointer"/>
          </Logout>
        )}
      </div>
      <StreamView creatorId={creatorId} />
    </div>
  );
} 