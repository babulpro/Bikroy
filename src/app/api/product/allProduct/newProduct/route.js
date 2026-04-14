// app/api/products/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";

// GET - Fetch all products (public)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        
        if (categoryId) {
            filter.categoryId = categoryId;
        }
        
        if (status) {
            filter.status = status;
        }
        
        if (search) {
            filter.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Get products with pagination
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: filter,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true
                        }
                    },
                    category: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: skip,
                take: limit
            }),
            prisma.product.count({ where: filter })
        ]);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// POST - Create new product (authenticated)
export async function POST(request) {
    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Decode token
        const decoded = await DecodedJwtToken(token);
        
        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        // Get request body
        const body = await request.json();
        const {
            name,
            description,
            price,
            currency = 'BDT',
            condition = 'NEW',
            contactPhone,
            contactEmail,
            type,
            categoryId,
            images = []
        } = body;

        // Validate required fields
        if (!name || !description || !price || !contactPhone || !categoryId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            );
        }

        // Check if product name is unique
        const existingProduct = await prisma.product.findUnique({
            where: { name: name }
        });

        if (existingProduct) {
            return NextResponse.json(
                { error: "Product name already exists" },
                { status: 400 }
            );
        }

        // Create product
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                currency,
                condition,
                contactPhone,
                contactEmail: contactEmail || null,
                type: type || null,
                categoryId,
                userId: user.id,
                images: images || [],
                viewCount: 0,
                isFeatured: false,
                isBoosted: false,
                status: 'ACTIVE'
            },
            include: {
                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: "Product created successfully"
        }, { status: 201 });

    } catch (error) {
        console.error('Product creation error:', error);
        return NextResponse.json(
            { error: error.message || "Failed to create product" },
            { status: 500 }
        );
    }
}