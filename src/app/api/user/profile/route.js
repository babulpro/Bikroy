// src/app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import prisma from '@/app/Utility/prisma/prisma';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;  

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
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

    // With jose, the data is directly in the payload
    // Your CreateJwtToken stores { role, id }
    const userId = decoded.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token structure - no user ID' },
        { status: 401 }
      );
    }
 

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) { 
    return NextResponse.json(
      { error: 'Something went wrong: ' + error.message },
      { status: 500 }
    );
  }
}