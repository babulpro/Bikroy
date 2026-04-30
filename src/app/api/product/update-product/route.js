// src/app/api/product/update-product/route.js
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

    const {
      productId,
      name,
      description,
      price,
      currency,
      condition,
      contactPhone,
      contactEmail,
      type,
      categoryId,
      image1,
      image2,
      image3,
      image4,
      image5,
      isFeatured,
      isBoosted,
      status
    } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { status: 'fail', msg: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: currentUserId
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { status: 'fail', msg: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price ? parseFloat(price) : existingProduct.price,
        currency: currency || existingProduct.currency,
        condition: condition || existingProduct.condition,
        contactPhone: contactPhone || existingProduct.contactPhone,
        contactEmail: contactEmail !== undefined ? contactEmail : existingProduct.contactEmail,
        type: type !== undefined ? type : existingProduct.type,
        categoryId: categoryId || existingProduct.categoryId,
        image1: image1 !== undefined ? image1 : existingProduct.image1,
        image2: image2 !== undefined ? image2 : existingProduct.image2,
        image3: image3 !== undefined ? image3 : existingProduct.image3,
        image4: image4 !== undefined ? image4 : existingProduct.image4,
        image5: image5 !== undefined ? image5 : existingProduct.image5,
        isFeatured: isFeatured !== undefined ? isFeatured : existingProduct.isFeatured,
        isBoosted: isBoosted !== undefined ? isBoosted : existingProduct.isBoosted,
        status: status || existingProduct.status
      }
    });

    return NextResponse.json({
      status: 'success',
      msg: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}