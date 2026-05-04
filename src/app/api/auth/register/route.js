// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/Utility/prisma/prisma';
import { RateLimiter } from '@/app/Utility/rateLimite/RateLimiter';

// Create rate limiter for registration
const registerRateLimiter = new RateLimiter();

// Validation patterns
const VALIDATION = {
    name: /^[a-zA-Z\u0980-\u09FF\s]{2,50}$/, // Bengali & English letters, spaces, 2-50 chars
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^.{6,}$/,
};

// Sanitize functions
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
        
        // Max 3 registration attempts per hour per IP
        if (!registerRateLimiter.isAllowed(ip, 3, 60 * 60 * 1000)) {
            return NextResponse.json(
                { 
                    status: 'failed', 
                    msg: 'Too many registration attempts. Please try again later.',
                    code: 'RATE_LIMIT_001'
                },
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

        // ========== 3. CHECK REQUIRED FIELDS ==========
        if (!name || !email || !password) {
            return NextResponse.json(
                { status: 'failed', msg: 'Name, email and password are required' },
                { status: 400 }
            );
        }

        // ========== 4. VALIDATE FIELD TYPES ==========
        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return NextResponse.json(
                { status: 'failed', msg: 'Invalid input format' },
                { status: 400 }
            );
        }

        // ========== 5. SANITIZE INPUTS ==========
        const sanitizedName = sanitizeName(name);
        const sanitizedEmail = sanitizeEmail(email);
        
        // ========== 6. VALIDATE NAME ==========
        if (!VALIDATION.name.test(sanitizedName)) {
            return NextResponse.json(
                { 
                    status: 'failed', 
                    msg: 'Name must be 2-50 characters and contain only letters and spaces' 
                },
                { status: 400 }
            );
        }

        // ========== 7. VALIDATE EMAIL FORMAT ==========
        if (!VALIDATION.email.test(sanitizedEmail)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // ========== 8. VALIDATE EMAIL LENGTH ==========
        if (sanitizedEmail.length > 100) {
            return NextResponse.json(
                { status: 'failed', msg: 'Email is too long' },
                { status: 400 }
            );
        }

        // ========== 9. VALIDATE PASSWORD ==========
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

        if (!VALIDATION.password.test(password)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // ========== 10. CHECK FOR XSS IN NAME ==========
        const xssPattern = /<script|javascript:|onclick|onerror|alert\(/i;
        if (xssPattern.test(sanitizedName)) {
            return NextResponse.json(
                { status: 'failed', msg: 'Invalid characters in name' },
                { status: 400 }
            );
        }

        // ========== 11. CHECK IF USER ALREADY EXISTS ==========
        let existingUser;
        try {
            existingUser = await prisma.user.findUnique({
                where: { email: sanitizedEmail },
                select: { id: true, email: true }
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json(
                { status: 'failed', msg: 'Service unavailable. Please try again.' },
                { status: 500 }
            );
        }

        if (existingUser) {
            // Generic message for security
            return NextResponse.json(
                { status: 'failed', msg: 'Email already registered' },
                { status: 400 }
            );
        }

        // ========== 12. HASH PASSWORD ==========
        let hashedPassword;
        try {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } catch (hashError) {
            console.error('Password hashing error:', hashError);
            return NextResponse.json(
                { status: 'failed', msg: 'Registration failed. Please try again.' },
                { status: 500 }
            );
        }

        // ========== 13. CREATE NEW USER ==========
        let newUser;
        try {
            newUser = await prisma.user.create({
                data: {
                    name: sanitizedName,
                    email: sanitizedEmail,
                    password: hashedPassword,
                    role: 'User',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });
        } catch (createError) {
            console.error('User creation error:', createError);
            return NextResponse.json(
                { status: 'failed', msg: 'Registration failed. Please try again.' },
                { status: 500 }
            );
        }

        // ========== 14. CLEAR RATE LIMITER ON SUCCESS ==========
        registerRateLimiter.clear(ip);

        // ========== 15. OPTIONAL: SEND WELCOME EMAIL ==========
        // You can implement email sending here
        // await sendWelcomeEmail(newUser.email, newUser.name);

        // ========== 16. RETURN SUCCESS RESPONSE ==========
        return NextResponse.json({
            status: 'success',
            msg: 'Registration successful! Please login to continue.',
            data: newUser
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        // Don't expose internal error details
        return NextResponse.json(
            { status: 'failed', msg: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}