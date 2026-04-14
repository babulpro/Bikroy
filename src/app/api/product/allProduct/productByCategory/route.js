import { NextResponse } from 'next/server';
import prisma from '@/app/Utility/prisma/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId'); 

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get all products in this category
    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true 
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(products);

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon
        },
        products: products,
        total: products.length
      }
    });

  } catch (error) {
    console.error('Fetch products by category error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}