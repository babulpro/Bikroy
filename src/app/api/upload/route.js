// src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import { z } from 'zod'; // Install: npm install zod

// Validation schemas
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const maxFileSize = 5 * 1024 * 1024; // 5MB
const allowedImageNumbers = ['image1', 'image2', 'image3', 'image4', 'image5'];

// Input validation schema
const uploadSchema = z.object({
  imageNumber: z.enum(['image1', 'image2', 'image3', 'image4', 'image5']).optional().default('image1'),
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(), // MongoDB ObjectId format
});

// Sanitize filename
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 100);
}

// Validate image dimensions (optional - requires sharp library)
async function validateImageDimensions(buffer, maxWidth = 4000, maxHeight = 4000) {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(buffer).metadata();
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      throw new Error(`Image dimensions too large. Max ${maxWidth}x${maxHeight}px`);
    }
    return true;
  } catch (error) {
    // If sharp is not available, skip dimension check
    console.warn('Sharp not available, skipping dimension validation');
    return true;
  }
}

export async function POST(request) {
  try {
    // ==================== 1. AUTHENTICATION VALIDATION ====================
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided', code: 'AUTH_001' },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Invalid or expired token', code: 'AUTH_002' },
        { status: 401 }
      );
    }

    // ==================== 2. REQUEST DATA VALIDATION ====================
    const formData = await request.formData();
    
    // Get and validate file
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded', code: 'FILE_001' },
        { status: 400 }
      );
    }

    // Validate file name (prevent path traversal)
    const originalFilename = file.name || 'unknown';
    if (originalFilename.includes('..') || originalFilename.includes('/') || originalFilename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename', code: 'FILE_002' },
        { status: 400 }
      );
    }

    // Validate imageNumber
    let imageNumber = formData.get('imageNumber') || 'image1';
    if (!allowedImageNumbers.includes(imageNumber)) {
      imageNumber = 'image1';
    }

    // Validate productId format if provided
    let productId = formData.get('productId');
    if (productId && !/^[0-9a-fA-F]{24}$/.test(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format', code: 'PROD_001' },
        { status: 400 }
      );
    }

    // ==================== 3. FILE TYPE VALIDATION ====================
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, JPG', code: 'FILE_003' },
        { status: 400 }
      );
    }

    // ==================== 4. FILE SIZE VALIDATION ====================
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`, code: 'FILE_004' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Empty file uploaded', code: 'FILE_005' },
        { status: 400 }
      );
    }

    // ==================== 5. FILE CONTENT VALIDATION ====================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Check for magic bytes / file signature (basic validation)
    const fileHeader = buffer.toString('hex', 0, 4).toUpperCase();
    const validHeaders = {
      'FFD8FFE0': 'JPEG',
      'FFD8FFE1': 'JPEG',
      'FFD8FFE2': 'JPEG',
      '89504E47': 'PNG',
      '52494646': 'WEBP',
    };
    
    if (!validHeaders[fileHeader]) {
      return NextResponse.json(
        { error: 'Invalid image content or corrupted file', code: 'FILE_006' },
        { status: 400 }
      );
    }

    // Optional: Validate image dimensions
    try {
      await validateImageDimensions(buffer);
    } catch (dimError) {
      return NextResponse.json(
        { error: dimError.message, code: 'FILE_007' },
        { status: 400 }
      );
    }

    // ==================== 6. RATE LIMITING (Basic) ====================
    // You can implement Redis or in-memory rate limiting here
    // This is a simple example - consider using upstash/redis for production
    const userUploadCount = await getUserUploadCount(decoded.id);
    if (userUploadCount > 50) { // Max 50 uploads per hour
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.', code: 'RATE_001' },
        { status: 429 }
      );
    }

    // ==================== 7. CONVERT TO BASE64 ====================
    const base64String = buffer.toString('base64');
    
    // ==================== 8. CLOUDINARY CONFIGURATION ====================
    const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'bikroy_unsigned';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName || !UPLOAD_PRESET) {
      console.error('Cloudinary configuration missing');
      return NextResponse.json(
        { error: 'Server configuration error', code: 'SYS_001' },
        { status: 500 }
      );
    }

    // ==================== 9. UPLOAD TO CLOUDINARY ====================
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', `data:${file.type};base64,${base64String}`);
    cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);
    cloudinaryFormData.append('folder', 'bikroy/products');
    
    // Add timestamp to prevent cache issues
    cloudinaryFormData.append('timestamp', Math.floor(Date.now() / 1000));

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
        headers: {
          'User-Agent': 'SellKoro-App/1.0'
        }
      }
    );

    const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary error:', result);
      return NextResponse.json(
        { error: result.error?.message || 'Cloudinary upload failed', code: 'CLOUD_001' },
        { status: 500 }
      );
    }

    // Validate Cloudinary response
    if (!result.secure_url || !result.public_id) {
      return NextResponse.json(
        { error: 'Invalid response from image service', code: 'CLOUD_002' },
        { status: 500 }
      );
    }

    // ==================== 10. UPDATE PRODUCT DATABASE ====================
    let updatedProduct = null;
    if (productId) {
      const { prisma } = await import('@/app/Utility/prisma/prisma');
      
      // Verify product ownership again
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          userId: decoded.id
        },
        select: { id: true, userId: true }
      });

      if (!product) {
        // If product doesn't belong to user, don't update but still return upload success
        console.warn(`User ${decoded.id} tried to update product ${productId} that doesn't belong to them`);
      } else {
        // Update only the specific image field
        updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: {
            [imageNumber]: result.secure_url
          },
          select: {
            id: true,
            image1: true,
            image2: true,
            image3: true,
            image4: true,
            image5: true
          }
        });
      }
    }

    // ==================== 11. LOG UPLOAD (Optional) ====================
    await logUploadActivity(decoded.id, result.public_id, productId);

    // ==================== 12. RETURN SUCCESS RESPONSE ====================
    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
        imageNumber: imageNumber,
        uploadedAt: new Date().toISOString()
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
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: 'Upload failed. Please try again.', code: 'SYS_999' },
      { status: 500 }
    );
  }
}

// ==================== HELPER FUNCTIONS ====================

// Simple in-memory rate limiting (for production, use Redis)
const userUploadCounts = new Map();

async function getUserUploadCount(userId) {
  const hour = Math.floor(Date.now() / (1000 * 60 * 60));
  const key = `${userId}-${hour}`;
  const count = userUploadCounts.get(key) || 0;
  userUploadCounts.set(key, count + 1);
  
  // Clean up old entries
  setTimeout(() => userUploadCounts.delete(key), 60 * 60 * 1000);
  
  return count;
}

// Log upload activity (optional - for audit trail)
async function logUploadActivity(userId, publicId, productId) {
  try {
    // You can store this in a database table for monitoring
    console.log(`[UPLOAD] User: ${userId}, PublicId: ${publicId}, Product: ${productId || 'new'}, Time: ${new Date().toISOString()}`);
  } catch (error) {
    // Don't fail the main operation if logging fails
    console.error('Logging failed:', error);
  }
}