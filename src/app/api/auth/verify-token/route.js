// src/app/api/auth/verify-token/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token found' 
      }, { status: 401 });
    }

    const decoded = await DecodedJwtToken(token);
    
    return NextResponse.json({
      success: true,
      hasToken: true,
      decoded: decoded,
      tokenPreview: token.substring(0, 50) + '...'
    });
  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}