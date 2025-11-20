export const dynamic = "force-dynamic";

import { getSession } from "@/app/lib/session";
import Navbarclient from "./Navbar";

export default async function NavbarServer(){
    const fullsession = await getSession();
    const sessionProp = fullsession ? fullsession.session : null
    return <Navbarclient session={sessionProp}/>
} 