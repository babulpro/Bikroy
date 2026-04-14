import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

 


 export async function POST(request,response){
    try{
        const reqBody = await request.json(); 
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if(!token){
            return NextResponse.json({status:"fail",msg:"Unauthorized"},{status:401})
        }

        const {area,city,state, country,latitude,longitude} = reqBody;

        if(!area || !city || !state  || !country){
            return NextResponse.json({status:"fail",msg:"please fill all the fields"})
        }

         const decodedToken = await DecodedJwtToken(token)
         const findUser = await prisma.user.findUnique({
            where:{
                id:decodedToken.id
            }
         })

         if(!findUser){
            return NextResponse.json({status:"fail",msg:"user not found"},{status:404})
         }
        console.log(area,city,state, country,latitude,longitude,findUser.id)


         const newAddress = await prisma.address.create({
            data:{
                userId:findUser.id,
                country ,
                state ,
                area ,
                latitude,city, 
                longitude 
            }
         })


        return NextResponse.json({status:"success",msg:"this is the user post request",data:newAddress})

    }
    catch(e){
        return NextResponse.json({status:"fail", msg:"something went wrong"},{status:500})
    }
 }