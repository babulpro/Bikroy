// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/Utility/prisma/prisma';
import { RateLimiter } from '@/app/Utility/rateLimite/RateLimiter';
import { CreateJwtToken } from '@/app/Utility/authFunction/JwtHelper';

const registerRateLimiter = new RateLimiter();

const VALIDATION = {
    name: /^[a-zA-Z\u0980-\u09FF\s]{2,50}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^.{6,}$/,
};

const sanitizeName = (name) => {
    return name.trim().replace(/[<>]/g, '').substring(0, 50);
};

const sanitizeEmail = (email) => {
    return email.trim().toLowerCase();
};

export async function POST(request) {
    try {
        // ========== 1. RATE LIMITING ==========
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
        
        if (!registerRateLimiter.isAllowed(ip, 3, 60 * 60 * 1000)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Too many registration attempts. Please try again later.' },
                { status: 429 }
            );
        }

        // ========== 2. PARSE REQUEST BODY ==========
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { status: 'failed', msg: 'Invalid request format' },
                { status: 400 }
            );
        }

        const { name, email, password } = body;

        // ========== 3-10. VALIDATION ==========
        if (!name || !email || !password) {
            return NextResponse.json(
                { status: 'failed', msg: 'Name, email and password are required' },
                { status: 400 }
            );
        }

        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return NextResponse.json(
                { status: 'failed', msg: 'Invalid input format' },
                { status: 400 }
            );
        }

        const sanitizedName = sanitizeName(name);
        const sanitizedEmail = sanitizeEmail(email);
        
        if (!VALIDATION.name.test(sanitizedName)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Name must be 2-50 characters and contain only letters and spaces' },
                { status: 400 }
            );
        }

        if (!VALIDATION.email.test(sanitizedEmail)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        if (sanitizedEmail.length > 100) {
            return NextResponse.json(
                { status: 'failed', msg: 'Email is too long' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { status: 'failed', msg: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        if (password.length > 100) {
            return NextResponse.json(
                { status: 'failed', msg: 'Password is too long' },
                { status: 400 }
            );
        }

        const xssPattern = /<script|javascript:|onclick|onerror|alert\(/i;
        if (xssPattern.test(sanitizedName)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Invalid characters in name' },
                { status: 400 }
            );
        }

        // ========== 11. CHECK EXISTING USER ==========
        const existingUser = await prisma.user.findUnique({
            where: { email: sanitizedEmail },
            select: { id: true, email: true }
        });

        if (existingUser) {
            return NextResponse.json(
                { status: 'failed', msg: 'Email already registered' },
                { status: 400 }
            );
        }

        // ========== 12. HASH PASSWORD ==========
        const hashedPassword = await bcrypt.hash(password, 10);

        // ========== 13. CREATE USER ==========
        const newUser = await prisma.user.create({
            data: {
                name: sanitizedName,
                email: sanitizedEmail,
                password: hashedPassword,
                role: 'User',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        registerRateLimiter.clear(ip);

        // ========== 14. GENERATE TOKEN (NEW USER) ==========
        const token = await CreateJwtToken(newUser.role, newUser.id, newUser.email);

        // ========== 15. CREATE RESPONSE WITH COOKIE ==========
        const response = NextResponse.json({
            status: 'success',
            msg: 'Registration successful! Welcome to SellKoro.',
            data: newUser
        }, { status: 201 });

        // Set cookie for auto-login
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { status: 'failed', msg: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}