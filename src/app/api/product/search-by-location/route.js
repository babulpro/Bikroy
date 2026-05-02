// src/app/api/product/search-by-location/route.js
import { NextResponse } from 'next/server';
import prisma from '@/app/Utility/prisma/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get('division');
    const district = searchParams.get('district');
    const thana = searchParams.get('thana');
    
    const filter = { status: 'ACTIVE' };
    if (division) filter.division = division;
    if (district) filter.district = district;
    if (thana) filter.thana = thana;
    
    const products = await prisma.product.findMany({
      where: filter,
      include: {
        user: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      location: { division, district, thana }
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}