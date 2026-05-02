// src/app/api/product/all-products/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/Utility/prisma/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const categoryId = searchParams.get('categoryId');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    // Location filters
    const division = searchParams.get('division');
    const district = searchParams.get('district');
    const thana = searchParams.get('thana');
    
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { status: 'ACTIVE' };
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    
    if (condition) {
      filter.condition = condition;
    }
    
    // Add location filters
    if (division && division !== '') {
      filter.division = division;
    }
    
    if (district && district !== '') {
      filter.district = district;
    }
    
    if (thana && thana !== '') {
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

    // Build sorting order
    let orderBy = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
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
              email: true
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
        orderBy: orderBy,
        skip: skip,
        take: limit
      }),
      prisma.product.count({ where: filter })
    ]);

    console.log('Filter applied:', { division, district, thana, total });

    return NextResponse.json({
      status: 'success',
      products: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total
      },
      appliedFilters: {
        division: division || null,
        district: district || null,
        thana: thana || null
      }
    });

  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}