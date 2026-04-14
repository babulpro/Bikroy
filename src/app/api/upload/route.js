// src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';

export async function POST(request) {
  try {
    // Check authentication
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

    const formData = await request.formData();
    const file = formData.get('file');
    const imageNumber = formData.get('imageNumber') || 'image1';
    const productId = formData.get('productId');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString('base64');
    
    // IMPORTANT: Create this preset in Cloudinary dashboard first!
    // Go to Settings → Upload → Upload presets → Add upload preset
    // Name: bikroy_unsigned, Mode: Unsigned
    const UPLOAD_PRESET = 'bikroy_unsigned';
    
    // Get cloud name from environment
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      console.error('Cloudinary cloud name is missing');
      return NextResponse.json(
        { error: 'Cloudinary configuration error' },
        { status: 500 }
      );
    }
    
    // Upload to Cloudinary using fetch
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', `data:${file.type};base64,${base64String}`);
    cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);
    cloudinaryFormData.append('folder', 'bikroy/products');
    
 
    
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData
      }
    );

    const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary error:', result);
      return NextResponse.json(
        { error: result.error?.message || 'Cloudinary upload failed' },
        { status: 500 }
      );
    } 

    // If productId is provided, update the product's specific image field
    let updatedProduct = null;
    if (productId) {
      const { prisma } = await import('@/app/Utility/prisma/prisma');
      
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          userId: decoded.id
        }
      });

      if (product) {
        updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: {
            [imageNumber]: result.secure_url
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        imageNumber: imageNumber
      },
      product: updatedProduct ? {
        id: updatedProduct.id,
        images: {
          image1: updatedProduct.image1,
          image2: updatedProduct.image2,
          image3: updatedProduct.image3,
          image4: updatedProduct.image4,
          image5: updatedProduct.image5
        }
      } : null
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}