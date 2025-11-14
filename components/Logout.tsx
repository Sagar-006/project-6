"use client"
import { authClient } from "@/app/lib/auth-client"
import {  useRouter } from "next/navigation"
import { Button } from "./ui/button"

export function Logout ({children}:{children:React.ReactNode}) {
    const router = useRouter()

    const LogOutUser  = async () => {
        await authClient.signOut();
        router.push('/');
        router.refresh();

    }

    return <Button className="cursor-pointer" variant={'secondary'} onClick={LogOutUser}>{children}</Button>
}