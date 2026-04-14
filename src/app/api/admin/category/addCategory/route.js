import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon } = body;

    // 🔴 Validation
    if (!name) {
      return NextResponse.json(
        { status: "fail", msg: "Name is required" },
        { status: 400 }
      );
    }

    // 🔍 Check existing category (by name OR slug)
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name: name },
          { slug: slug || "" },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { status: "fail", msg: "Category already exists" },
        { status: 409 } // conflict
      );
    }

    // ✨ Create category
    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: description || "",
        icon: icon || "",
      },
    });

    return NextResponse.json(
      {
        status: "success",
        msg: "Category created successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { status: "error", msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}