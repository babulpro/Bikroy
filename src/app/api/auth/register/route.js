// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/Utility/prisma/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body; 

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { status: 'failed', msg: 'Please fill all fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma .user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return NextResponse.json(
        { status: 'failed', msg: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: 'User', // Default role from schema
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      status: 'success',
      msg: 'User registered successfully',
      data: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { status: 'failed', msg: 'Something went wrong' },
      { status: 500 }
    );
  }
}