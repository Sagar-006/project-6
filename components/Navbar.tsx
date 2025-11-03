import Link from "next/link"
import { Button } from "./ui/button";
import { getSession } from "@/app/lib/session";
import { Logout } from "./Logout";

export default async function Navbar()  {
  const session = await getSession();
  return (
    <nav className="w-full flex flex-row justify-between px-32 gap-x-6 text-2xl py-2">
      {/* <Link href={"/"}>Home</Link> */}
      <div className="text-white font-semibold ">
        <h1>MUZER</h1>
      </div>
      <div>
        {session?.user ? (
          <div>
            <Logout>Logout</Logout>
          </div>
        ) : (
          <div className="flex gap-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Link href={"/auth/signup"}>Signup</Link>
            </Button>
            <Button className="bg-white text-black hover:bg-white/90">
              <Link href={"/auth/signin"}>Signin</Link>
            </Button>
          </div>
        )}
      </div>
      {/* <Link href={"/dashboard"}>Dashboard</Link> */}
    </nav>
  );
}


