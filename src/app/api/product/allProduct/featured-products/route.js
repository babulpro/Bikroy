// src/app/api/product/featured-products/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/Utility/prisma/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 8;
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    // Build filter
    const filter = {
      status: 'ACTIVE'  // Only show active products
    };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get featured products (isFeatured = true) or latest products
    const products = await prisma.product.findMany({
      where: filter,
      orderBy: [
        { isFeatured: 'desc' },  // Featured products first
        { createdAt: 'desc' }     // Then newest
      ],
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json({
      status: 'success',
      products: products,
      total: products.length
    });

  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}