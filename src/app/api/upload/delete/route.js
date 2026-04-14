// src/app/api/upload/delete/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import cloudinary from '@/app/Utility/cloudinary';

export async function DELETE(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const productId = searchParams.get('productId');
    const imageField = searchParams.get('imageField');

     

    if (!publicId || !productId || !imageField) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Delete using Cloudinary SDK (handles signature automatically)
    const result = await cloudinary.uploader.destroy(publicId);
    
     

    if (result.result !== 'ok') {
      console.error('Cloudinary delete warning:', result);
    }

    // Update product to remove image field
    const { prisma } = await import('@/app/Utility/prisma/prisma');
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        [imageField]: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed: ' + error.message },
      { status: 500 }
    );
  }
}