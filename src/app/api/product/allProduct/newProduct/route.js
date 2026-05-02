// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

export async function POST(request) {
  try {
    // Get authentication token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Decode token
    const decoded = await DecodedJwtToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
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
      division,
      district,
      thana,
      image1,
      image2,
      image3,
      image4,
      image5,
      isFeatured = false,
      isBoosted = false
    } = body;

    // Validate required fields
    if (!name || !description || !price || !contactPhone || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, contactPhone, categoryId are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if product name is unique
    const existingProduct = await prisma.product.findUnique({
      where: { name: name }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product name already exists. Please use a different name.' },
        { status: 400 }
      );
    }

    // Create product with location fields
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
        division: division || null,
        district: district || null,
        thana: thana || null,
        image1: image1 || null,
        image2: image2 || null,
        image3: image3 || null,
        image4: image4 || null,
        image5: image5 || null,
        viewCount: 0,
        isFeatured: isFeatured || false,
        isBoosted: isBoosted || false,
        status: 'ACTIVE'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    }, { status: 201 });

  } catch (error) {
    console.error('Product creation error:', error);
    
    // Handle unique constraint error
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json(
        { error: 'Product name already exists. Please use a different name.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

// GET - Fetch all products (with pagination, filters, and location search)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status') || 'ACTIVE';
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    
    // Location filters
    const division = searchParams.get('division');
    const district = searchParams.get('district');
    const thana = searchParams.get('thana');
    
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { status };
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    
    if (condition) {
      filter.condition = condition;
    }
    
    if (division) {
      filter.division = division;
    }
    
    if (district) {
      filter.district = district;
    }
    
    if (thana) {
      filter.thana = thana;
    }
    
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.gte = parseFloat(minPrice);
      if (maxPrice) filter.price.lte = parseFloat(maxPrice);
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
              email: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
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
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total
      },
      filters: {
        division: division || null,
        district: district || null,
        thana: thana || null
      }
    });

  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}