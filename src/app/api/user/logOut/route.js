 
import { NextResponse } from "next/server";

export async function GET(request,response) {
    try{ 
        const response = NextResponse.json({status:"success",msg:"Logout successful"},{status:200})
        response.cookies.delete('token')
        return response

        
 

    }
    catch(e){
        return NextResponse.json({status:"fail",msg:"something went wrong"})
    }
    
}