// src/app/api/auth/login/route.js
import prisma from "@/app/Utility/prisma/prisma";
import { NextResponse } from "next/server"; 
import { CreateJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        if (!email || !password) {
            return NextResponse.json(
                { status: "fail", msg: "Please fill all fields" },
                { status: 400 }
            );
        }

        const findUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!findUser) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid credentials" },
                { status: 401 }
            );
        }

        const matchPassword = await bcrypt.compare(password, findUser.password);

        if (!matchPassword) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Note: Your CreateJwtToken expects (role, id) order
        const token = await CreateJwtToken(findUser.role, findUser.id);

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

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong" },
            { status: 500 }
        );
    }
}