// src/app/api/product/delete-product/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { status: 'fail', msg: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token);
    const currentUserId = decoded.id;

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { status: 'fail', msg: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: currentUserId
      }
    });

    if (!product) {
      return NextResponse.json(
        { status: 'fail', msg: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({
      status: 'success',
      msg: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}