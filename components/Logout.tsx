"use client"
import { auth } from "@/app/lib/auth"
import { authClient } from "@/app/lib/auth-client"
import { redirect } from "next/navigation"

export function Logout ({children}:{children:React.ReactNode}) {
    const LogOutUser  = async () => {
        const data = await authClient.signOut({
            fetchOptions:{
                onSuccess:() => {
                    redirect("/auth/signup")
                }
            }
        })
    }

    return <button onClick={LogOutUser}>{children}</button>
}