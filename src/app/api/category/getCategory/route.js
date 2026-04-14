// src/app/api/admin/category/getCategories/route.js

import { NextResponse } from "next/server";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";

// GET - Fetch all categories (Public - No authentication required)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get categories with pagination
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where: filter,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              status: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        },
        skip: skip,
        take: limit
      }),
      prisma.category.count({ where: filter })
    ]);

    // Add product count to each category
    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: category.product.length,
      product: undefined // Remove product array from response
    }));

    return NextResponse.json({
      status: "success",
      data: categoriesWithCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { status: "fail", msg: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}