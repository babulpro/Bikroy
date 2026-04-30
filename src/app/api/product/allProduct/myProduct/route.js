import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request,response){
    try{
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value;
        if(!token){
            return NextResponse.json({status:"fail",msg:"Unauthorized"},{status:401})
        }
        const decoded = await DecodedJwtToken(token)
        const currentUserId = decoded.id;
        const checkUser = await prisma.user.findUnique({
            where:{id:currentUserId}
        })

        if(!checkUser){
            return NextResponse.json({status:"fail",msg:"Unauthorized"},{status:401})
        }

        const myProducts = await prisma.product.findMany({
            where:{userId:currentUserId}
        })
        return NextResponse.json({status:"success",products:myProducts},{status:200 })


    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"},{status:401})
    }
}