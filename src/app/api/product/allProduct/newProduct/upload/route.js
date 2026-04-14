// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
    try {
        // Check authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = await DecodedJwtToken(token);
        
        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        // Get files from form data
        const formData = await request.formData();
        const files = formData.getAll('files');
        const productId = formData.get('productId');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files uploaded" },
                { status: 400 }
            );
        }

        // Upload each file to Cloudinary
        const uploadedImages = [];
        
        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: `File ${file.name} is not an image` },
                    { status: 400 }
                );
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: `File ${file.name} must be less than 5MB` },
                    { status: 400 }
                );
            }

            // Convert to base64
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64Image = buffer.toString('base64');
            const dataURI = `data:${file.type};base64,${base64Image}`;

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'bikroy/products',
                resource_type: 'image',
                transformation: [
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' },
                    { width: 1200, crop: 'limit' }
                ]
            });

            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id,
                format: result.format,
                size: result.bytes
            });
        }

        // If productId is provided, update product images
        let product = null;
        if (productId) {
            const existingProduct = await prisma.product.findFirst({
                where: {
                    id: productId,
                    userId: decoded.id
                }
            });

            if (existingProduct) {
                const newImageUrls = uploadedImages.map(img => img.url);
                const updatedImages = [...(existingProduct.images || []), ...newImageUrls];
                
                product = await prisma.product.update({
                    where: { id: productId },
                    data: { images: updatedImages }
                });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                images: uploadedImages,
                product: product ? {
                    id: product.id,
                    images: product.images,
                    totalImages: product.images.length
                } : null
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: "Upload failed: " + error.message },
            { status: 500 }
        );
    }
}