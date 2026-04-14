// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";

// GET - Fetch single product
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const product = await prisma.product.findUnique({
            where: { id: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                        address: true
                    }
                },
                category: true,
                favorite: true
            }
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Increment view count
        await prisma.product.update({
            where: { id: id },
            data: { viewCount: { increment: 1 } }
        });

        return NextResponse.json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Product fetch error:', error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// PUT - Update product
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
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: id,
                userId: decoded.id
            }
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found or unauthorized" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const {
            name,
            description,
            price,
            currency,
            condition,
            contactPhone,
            contactEmail,
            type,
            categoryId,
            images,
            status,
            isFeatured,
            isBoosted
        } = body;

        // Update product
        const updatedProduct = await prisma.product.update({
            where: { id: id },
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
                images: images || existingProduct.images,
                status: status || existingProduct.status,
                isFeatured: isFeatured !== undefined ? isFeatured : existingProduct.isFeatured,
                isBoosted: isBoosted !== undefined ? isBoosted : existingProduct.isBoosted
            },
            include: {
                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedProduct,
            message: "Product updated successfully"
        });

    } catch (error) {
        console.error('Product update error:', error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
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

        // Delete product
        await prisma.product.delete({
            where: { id: id }
        });

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error('Product delete error:', error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}