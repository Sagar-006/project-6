import { redirect } from "next/navigation";
import { getSession, requireAuth } from "../lib/session";
import AddSongForm from "@/components/StreamView/AddSongForm";
import StreamView from "@/components/StreamView";
import { Logout } from "@/components/Logout";
import { LogOut } from "lucide-react";
import NavbarServer from "@/components/NavbarServer";

export default async function Dashboard(){
  const session = await getSession();
  if(!session){
    redirect("/auth/signin")
  }

  const creatorId =  session.user.id;
  console.log('this is Creator Id',creatorId)

  return (
    <div className="bg-black h-full w-full ">
      <div className="flex justify-end mx-32 pt-4">
       
      </div>
      <StreamView creatorId={creatorId} />
    </div>
  );
} 