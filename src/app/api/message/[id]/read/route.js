// src/app/api/message/route.js (Secure Version)
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';
import { rateLimit } from '@/app/Utility/rateLimite/RateLimiter';

const messageRateLimiter = new Map();

function checkRateLimit(ip, limit = 20, windowMs = 60000) {
  const now = Date.now();
  const requests = messageRateLimiter.get(ip) || [];
  const valid = requests.filter(t => now - t < windowMs);
  if (valid.length >= limit) return false;
  valid.push(now);
  messageRateLimiter.set(ip, valid);
  return true;
}

// Validation patterns
const MESSAGE_PATTERN = /^[\s\S]{1,1000}$/;
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: 'Too many messages. Please slow down.' }, { status: 429 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await DecodedJwtToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await request.json();
    let { text, receiverId, productId } = body;

    if (!text || !receiverId || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate ObjectId format
    if (!OBJECT_ID_PATTERN.test(receiverId) || !OBJECT_ID_PATTERN.test(productId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Prevent self-messaging
    if (decoded.id === receiverId) {
      return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 });
    }

    // Sanitize and validate message
    text = text.trim().substring(0, 1000);
    if (!MESSAGE_PATTERN.test(text)) {
      return NextResponse.json({ error: 'Invalid message content' }, { status: 400 });
    }

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, status: 'ACTIVE' },
      select: { id: true, userId: true }
    });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Verify receiver is the product owner
    if (product.userId !== receiverId) {
      return NextResponse.json({ error: 'Invalid receiver' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { text, senderId: decoded.id, receiverId, productId },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, name: true, image1: true, price: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: { ...message, isOwn: true }
    }, { status: 201 });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await DecodedJwtToken(token);
    if (!decoded?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json({ error: 'userId and productId required' }, { status: 400 });
    }

    if (!OBJECT_ID_PATTERN.test(userId) || !OBJECT_ID_PATTERN.test(productId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        productId,
        OR: [
          { senderId: decoded.id, receiverId: userId },
          { senderId: userId, receiverId: decoded.id }
        ]
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
        product: { select: { id: true, name: true, image1: true, price: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: messages.map(msg => ({ ...msg, isOwn: msg.senderId === decoded.id }))
    });

  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}