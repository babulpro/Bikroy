// src/app/api/auth/login/route.js
import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server"; 
import { CreateJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import bcrypt from "bcrypt";
import { RateLimiter } from "@/app/Utility/rateLimite/RateLimiter";

// Create a rate limiter instance for login attempts
const loginRateLimiter = new RateLimiter();

export async function POST(request) {
    try {
        // ========== 1. GET IP ADDRESS ==========
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
        
        // ========== 2. CHECK RATE LIMIT ==========
        if (!loginRateLimiter.isAllowed(ip, 5, 15 * 60 * 1000)) {
            return NextResponse.json(
                { 
                    status: "fail", 
                    msg: "Too many login attempts. Please try again after 15 minutes.",
                    code: "RATE_LIMIT_001" 
                },
                { status: 429 }
            );
        }

        // ========== 3. GET REQUEST BODY WITH ERROR HANDLING ==========
        let reqBody;
        try {
            reqBody = await request.json();
        } catch {
            return NextResponse.json(
                { status: "fail", msg: "Invalid request format" },
                { status: 400 }
            );
        }

        const { email, password } = reqBody;

        // ========== 4. VALIDATE INPUT TYPES ==========
        if (typeof email !== 'string' || typeof password !== 'string') {
            return NextResponse.json(
                { status: "fail", msg: "Invalid input format" },
                { status: 400 }
            );
        }

        // ========== 5. VALIDATE FIELDS ==========
        if (!email || !password) {
            return NextResponse.json(
                { status: "fail", msg: "Email and password are required" },
                { status: 400 }
            );
        }

        // ========== 6. EMAIL FORMAT VALIDATION ==========
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid email format" },
                { status: 400 }
            );
        }

        // ========== 7. PASSWORD LENGTH VALIDATION ==========
        if (password.length < 6 || password.length > 100) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid password format" },
                { status: 400 }
            );
        }

        // ========== 8. FIND USER (CASE-INSENSITIVE EMAIL) ==========
        const findUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }, // Store emails in lowercase
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                isActive: true,    // Add this to schema
                isVerified: true   // Add this to schema
            }
        });

        // Generic error message for security (don't reveal if email exists)
        if (!findUser) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid email or password" },  // Generic message
                { status: 401 }
            );
        }

        // ========== 9. CHECK IF ACCOUNT IS ACTIVE ==========
        if (findUser.isActive === false) {
            return NextResponse.json(
                { status: "fail", msg: "Your account has been deactivated. Contact support." },
                { status: 401 }
            );
        }

        // ========== 10. VERIFY PASSWORD ==========
        const matchPassword = await bcrypt.compare(password, findUser.password);

        if (!matchPassword) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid email or password" }, // Generic message
                { status: 401 }
            );
        }

        // ========== 11. SUCCESS - CLEAR RATE LIMITER ==========
        loginRateLimiter.clear(ip);

        // ========== 12. UPDATE LAST LOGIN (Optional - add to schema) ==========
        await prisma.user.update({
            where: { id: findUser.id },
            data: { lastLoginAt: new Date() }
        }).catch(() => {}); // Don't fail login if this fails

        // ========== 13. GENERATE TOKEN ==========
        const token = await CreateJwtToken(findUser.role, findUser.id, findUser.email);

        // ========== 14. CREATE RESPONSE ==========
        const response = NextResponse.json({
            status: "success",
            msg: "Login successful",
            data: {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                role: findUser.role
            }
        });

        // ========== 15. SET SECURE COOKIE ==========
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", // Better security
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        // Don't expose internal error details
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}