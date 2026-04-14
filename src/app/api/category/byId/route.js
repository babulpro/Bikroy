// src/app/api/category/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/Utility/prisma/prisma";

export async function GET(request ) {
  try {
     const {searchPrams} = new URL(request.url);
     const id = searchPrams.get('id');
     console.log("Category ID is found #####:", id);

    //  if (!id) {
    //    return NextResponse.json(
    //      { status: "fail", msg: "Category ID is required" },
    //      { status: 400 }
    //    );
    //  }
      // const categoryId = parseInt(id);
    // const category = await prisma.category.findUnique({
    //   where: { id: categoryId },
    //   include: {
    //     product: {
    //       select: {
    //         id: true,
    //         name: true,
    //       }

    //     }
    //   }
    // });

    // if (!category) {
    //   return NextResponse.json(
    //     { status: "fail", msg: "Category not found" },
    //     { status: 404 }
    //   );
    // }

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