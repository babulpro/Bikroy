// src/app/api/product/update-status/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

export async function PUT(request) {
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

    const { productId, status } = await request.json();

    if (!productId || !status) {
      return NextResponse.json(
        { status: 'fail', msg: 'Product ID and status are required' },
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

    // Update product status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status }
    });

    return NextResponse.json({
      status: 'success',
      msg: `Product ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`,
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}