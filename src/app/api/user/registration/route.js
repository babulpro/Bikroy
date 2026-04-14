 
import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server"; 
import { CreateJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import bcrypt from "bcrypt"

export async function POST(request,response){
    try{
        const reqBody = await request.json();
        const {name,email,password,role} = reqBody;
       
        

        if(!name || !email || !password){
            return NextResponse.json({status:"fail",msg:"please fill all the fields"})
        }

        

        const findUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(findUser){
            return NextResponse.json({status:"fail",msg:"user already exists"})
        }

        const bcryptPassword = await bcrypt.hash(password,10);
        console.log(bcryptPassword)
        

        const newUser = await prisma.user.create({
            data:{
                name:name,
                role:role,
                email:email,
                password:bcryptPassword
            }
        })

        

        const token = await CreateJwtToken(newUser.role,newUser.id)
        const response  = NextResponse.json({status:"success",msg:"user created successfully"})
        response.cookies.set({name:"token",value:token,httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:60*60*24*7  })


        
        return response

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
}