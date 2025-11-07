
import Link from "next/link"
import { Button } from "./ui/button";
import { getSession } from "@/app/lib/session";
import { Logout } from "./Logout";

export default async function Navbarclient({session}:{session:any})  {
  // const session = await getSession();
  return (
    <nav className="fixed top-0 left-0 w-full z-50  px-8 py-4 flex justify-between items-center">
      <div className="text-white font-semibold ">
        <h1 className="text-xl">MUZER</h1>
      </div>
      <div>
        {session?.user ? (
          <div>
            <Logout>Logout</Logout>
          </div>
        ) : (
          <div className="flex gap-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Link href={"/auth/signin"}>Signin</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}


