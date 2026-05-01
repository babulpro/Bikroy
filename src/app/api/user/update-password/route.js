// src/app/api/user/update-password/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';
import bcrypt from 'bcrypt';

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

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { status: 'fail', msg: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { status: 'fail', msg: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json(
        { status: 'fail', msg: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { status: 'fail', msg: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      status: 'success',
      msg: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { status: 'fail', msg: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}