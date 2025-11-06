import prisma from "@/app/lib/db";
import { getSession } from "@/app/lib/session";
import {  NextResponse } from "next/server";

export async function GET(){
    const session = await getSession();
    const user = await prisma.user.findFirst({
        where:{
            email:session?.user?.email
        }
    });

    if(!user){
        return NextResponse.json({
            message:"Unauthenticated"
        },{
            status:403
        })
    }

    const mostUpvotedStream = await prisma.stream.findFirst({
        where:{
            userId:user.id,
            played:false,
        },
        orderBy:{
            upvotes:{
                _count:'desc'
            }
        }
    });

    await  Promise.all([prisma.currentStream.upsert({
        where:{
            userId:user.id
        },
        update:{
            userId:user.id,
            streamId:mostUpvotedStream?.id,

        },
        create:{
            userId:user.id,
            streamId:mostUpvotedStream?.id
        }
    }),prisma.stream.update({
        where:{
            id:mostUpvotedStream?.id ?? ''
        },
        data:{
            played:true,
            playedTs:new Date()
        }
    })

    ]);
    return NextResponse.json({
        stream:mostUpvotedStream
    })
} 