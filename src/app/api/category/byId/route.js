// src/app/api/category/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/Utility/prisma/prisma";

export async function GET(request ) {
  try {
     const {searchPrams} = new URL(request.url);
     const id = searchPrams.get('id'); 

    

    return NextResponse.json({
      status: "success",
       id 
    });

  } catch (error) {
    return NextResponse.json(
      { status: "fail", msg: error.message },
      { status: 500 }
    );
  }
}