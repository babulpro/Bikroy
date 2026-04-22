// src/app/api/messages/conversations/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DecodedJwtToken } from '@/app/Utility/authFunction/JwtHelper';
import prisma from '@/app/Utility/prisma/prisma';

// GET - Get all conversations for the logged-in user
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

    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: decoded.id },
          { receiverId: decoded.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
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
        createdAt: 'desc'
      }
    });

    // Group messages by conversation (unique combination of users and product)
    const conversations = new Map();

    messages.forEach(message => {
      const otherUser = message.senderId === decoded.id ? message.receiver : message.sender;
      const conversationKey = `${otherUser.id}-${message.productId}`;
      
      if (!conversations.has(conversationKey)) {
        conversations.set(conversationKey, {
          user: otherUser,
          product: message.product,
          lastMessage: message.text,
          lastMessageTime: message.createdAt,
          unreadCount: message.receiverId === decoded.id && !message.read ? 1 : 0,
          messages: [message]
        });
      } else {
        const existing = conversations.get(conversationKey);
        if (message.receiverId === decoded.id && !message.read) {
          existing.unreadCount++;
        }
        existing.messages.push(message);
        if (message.createdAt > existing.lastMessageTime) {
          existing.lastMessage = message.text;
          existing.lastMessageTime = message.createdAt;
        }
      }
    });

    const conversationList = Array.from(conversations.values()).sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    return NextResponse.json({
      success: true,
      data: conversationList
    });

  } catch (error) {
    console.error('Fetch conversations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}