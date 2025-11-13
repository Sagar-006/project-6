
import Link from "next/link"
import { Button } from "./ui/button";
import { Logout } from "./Logout";
import ThemeToggle from "./ThemeToggle";
import { Session } from "better-auth";

type SessionType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  // add user if needed
  // user?: { ... };
};
export default async function Navbarclient({session}:{session:SessionType | null})  {
  // const session = await getSession();
  return (
    <nav className="fixed top-0 left-0 w-full z-50  px-8 py-4 flex justify-between items-center">
      <div className="dark:text-white text-black  font-semibold ">
        <h1 className="text-xl ">MUZER</h1>
      </div>
      <div className="flex gap-x-4">
        <div>
          {session ? (
            <div>
              <Logout >Logout</Logout>
            </div>
          ) : (
            <div className="flex gap-x-4 text-white">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Link href={"/auth/signin"}>Signin</Link>
              </Button>
            </div>
          )}
        </div>
        <div>
          <ThemeToggle/>
        </div>
      </div>
    </nav>
  );
}


