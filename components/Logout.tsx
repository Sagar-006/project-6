"use client"
import { auth } from "@/app/lib/auth"
import { authClient } from "@/app/lib/auth-client"
import { redirect } from "next/navigation"
import { Button } from "./ui/button"

export function Logout ({children}:{children:React.ReactNode}) {
    const LogOutUser  = async () => {
        const data = await authClient.signOut({
            fetchOptions:{
                onSuccess:() => {
                    redirect("/")
                }
            }
        })
    }

    return <Button variant={'secondary'} onClick={LogOutUser}>{children}</Button>
}