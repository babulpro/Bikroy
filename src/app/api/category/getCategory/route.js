// src/app/api/category/getCategory/route.js
import { NextResponse } from "next/server";
import prisma from "@/app/Utility/prisma/prisma";

// GET - Fetch all categories (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build filter
    const filter = {};
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get all categories with product count
    const categories = await prisma.category.findMany({
      where: filter,
      include: {
        product: {
          where: { status: 'ACTIVE' },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Add product count to each category
    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      productCount: category.product.length,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return NextResponse.json({
      status: "success",
      data: categoriesWithCount,
      total: categoriesWithCount.length
    });

  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { status: "fail", msg: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}