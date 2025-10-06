import { redirect } from "next/navigation";
import { getSession, requireAuth } from "../lib/session";
import AddSongForm from "@/components/StreamView/AddSongForm";
import StreamView from "@/components/StreamView";

export default async function Dashboard(){
  const session = await getSession();
  if(!session){
    redirect("/auth/signup")
  }

  const userId =  session.user.id;
  console.log(userId)

  return (
    <div>
      <div>
        <h1>Welcome {session?.user.name} </h1>
      </div>
      <StreamView userId={userId}/>
    </div>
  );
} 