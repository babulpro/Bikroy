import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server";


export async function POST(request,response){
    try{
        const reqBody =await request.json()
        const {name,slug,description,icon} = reqBody
        const findCategory = await prisma.category.findUnique({
            where:{
                name:name
            }
        })

        if(findCategory){
            return NextResponse.json({status:"fail",msg:"already category "},{status:202})
        }
        const newCategory = await prisma.category.create({
            data:{
                name:name,
                slug:slug ||"",
                description: description || "",
                icon:icon || ""
            }
        })

        return NextResponse.json({status:"success",msg:"category created successfully" } ,{status:200})

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"},{status:201})
    }
}