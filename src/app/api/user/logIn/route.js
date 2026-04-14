 
import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server"; 
import { CreateJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import bcrypt from "bcrypt"

export async function POST(request,response){
    try{
        const reqBody = await request.json();
        const { email,password } = reqBody; 
       
        

        if(!email || !password){
            return NextResponse.json({status:"fail",msg:"please fill all the fields"})
        }

        

        const findUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        }) 

        if(!findUser){
            return NextResponse.json({status:"fail",msg:"user not found"})
        }

        const  matchPassword = await bcrypt.compare(password,findUser.password) 

        if(!matchPassword){
            return NextResponse.json({status:"fail",msg:"invalid credentials"})
        }        
 

        

        const token = await CreateJwtToken(findUser.role,findUser.id)

        const response  = NextResponse.json({status:"success",msg:"user login successfully"})
        response.cookies.set({name:"token",value:token,httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:60*60*24*7  })


        
        return response

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
}