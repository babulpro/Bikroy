import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server";

export async function  GET(Request,response) {
    try{
        const category= await prisma.category.findMany()
        return NextResponse.json({status:"success",data:category})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"},{status:201})
    }
    
}