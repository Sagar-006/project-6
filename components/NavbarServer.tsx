import { getSession } from "@/app/lib/session";
import Navbarclient from "./Navbar";

export default async function NavbarServer(){
    const session = await getSession();
    return <Navbarclient session={session}/>
} 