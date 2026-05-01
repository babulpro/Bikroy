// src/app/api/user/update-profile/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { status: 'fail', msg: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { status: 'fail', msg: 'Invalid token' },
        { status: 401 }
      );
    }

    const { name, email, avatar } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { status: 'fail', msg: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: decoded.id }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { status: 'fail', msg: 'Email already in use' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name,
        email,
        avatar: avatar || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      status: 'success',
      msg: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}