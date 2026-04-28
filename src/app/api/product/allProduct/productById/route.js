// src/app/api/product/allProduct/productById/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/Utility/prisma/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId'); 

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch product with related data (user and category)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true, 
            createdAt: true
          }
        } ,
         category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
   
    // Increment view count
    await prisma.product.update({
      where: { id: productId },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}