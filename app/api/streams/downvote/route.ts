import db from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const DownvoteSchema = z.object({
    userId:z.string(),
    streamId:z.string(),
})
export async function POST(req:NextRequest){
    const session = await getSession();

    if(!session?.user){
        return NextResponse.json(
            {
                message:"Unauthenticated"
            },
            {
                status:403,
            }
        )
    };

    const user = session.user;

    try{
        const data = DownvoteSchema.parse(await req.json());
        await db.upvote.delete({
            where:{
                userId_streamId:{
                    userId:user.id,
                    streamId:data.streamId,
                }
            }
        });

        return NextResponse.json(
            {
                message:"Done!",
            }
        );
    }
    catch(e){
        return NextResponse.json(
            {
                message:"Error while Downvoting",

            },
            {
                status:403,
            }
        )
    }
}