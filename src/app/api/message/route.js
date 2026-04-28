// src/app/api/messages/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

// POST - Send a new message
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Received message body:', body);
    const { text, receiverId, productId } = body;

    if (!text || !receiverId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: text, receiverId, productId' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if receiver is the product owner
    if (product.userId !== receiverId) {
      return NextResponse.json(
        { error: 'You can only message the product seller' },
        { status: 400 }
      );
    }

    // Don't allow sending message to yourself
    if (decoded.id === receiverId) {
      return NextResponse.json(
        { error: 'You cannot send message to yourself' },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        text,
        senderId: decoded.id,
        receiverId,
        productId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            image1: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: message
    }, { status: 201 });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET - Get all messages for the logged-in user
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await DecodedJwtToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationWith = searchParams.get('userId');
    const productId = searchParams.get('productId');

    let filter = {
      OR: [
        { senderId: decoded.id },
        { receiverId: decoded.id }
      ]
    };

    if (conversationWith) {
      filter = {
        AND: [
          filter,
          {
            OR: [
              { senderId: conversationWith, receiverId: decoded.id },
              { senderId: decoded.id, receiverId: conversationWith }
            ]
          }
        ]
      };
    }

    if (productId) {
      filter.productId = productId;
    }

    const messages = await prisma.message.findMany({
      where: filter,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            image1: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}