// app/api/products/[id]/images/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";

// DELETE - Remove specific image
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image URL required" },
                { status: 400 }
            );
        }

        // Get token
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

        // Check if product exists and belongs to user
        const product = await prisma.product.findFirst({
            where: {
                id: id,
                userId: decoded.id
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found or unauthorized" },
                { status: 404 }
            );
        }

        // Remove image from array
        const updatedImages = (product.images || []).filter(img => img !== imageUrl);

        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: { images: updatedImages }
        });

        return NextResponse.json({
            success: true,
            data: {
                images: updatedProduct.images,
                total: updatedProduct.images.length
            },
            message: "Image deleted successfully"
        });

    } catch (error) {
        console.error('Delete image error:', error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}

// PUT - Reorder images
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        
        // Get token
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

        // Check if product exists and belongs to user
        const product = await prisma.product.findFirst({
            where: {
                id: id,
                userId: decoded.id
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found or unauthorized" },
                { status: 404 }
            );
        }

        const { imageOrder } = await request.json();

        if (!imageOrder || !Array.isArray(imageOrder)) {
            return NextResponse.json(
                { error: "Invalid image order" },
                { status: 400 }
            );
        }

        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: { images: imageOrder }
        });

        return NextResponse.json({
            success: true,
            data: {
                images: updatedProduct.images
            },
            message: "Images reordered successfully"
        });

    } catch (error) {
        console.error('Reorder images error:', error);
        return NextResponse.json(
            { error: "Failed to reorder images" },
            { status: 500 }
        );
    }
}