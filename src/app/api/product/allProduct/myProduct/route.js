// src/app/api/product/allProduct/myProduct/route.js
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ status: "fail", msg: "Unauthorized" }, { status: 401 });
        }
        
        const decoded = await DecodedJwtToken(token);
        if (!decoded?.id) {
            return NextResponse.json({ status: "fail", msg: "Invalid token" }, { status: 401 });
        }
        
        const currentUserId = decoded.id;
        
        const checkUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { id: true, isActive: true }
        });
        
        if (!checkUser || !checkUser.isActive) {
            return NextResponse.json({ status: "fail", msg: "Unauthorized" }, { status: 401 });
        }
        
        const myProducts = await prisma.product.findMany({
            where: { userId: currentUserId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                currency: true,
                condition: true,
                status: true,
                viewCount: true,
                createdAt: true,
                updatedAt: true,
                image1: true,
                image2: true,
                image3: true,
                image4: true,
                image5: true,
                type: true,
                isFeatured: true,
                isBoosted: true
            }
        });
        
        return NextResponse.json({ status: "success", products: myProducts }, { status: 200 });
        
    } catch (error) {
        console.error('Fetch my products error:', error);
        return NextResponse.json({ status: "fail", msg: "Something went wrong" }, { status: 500 });
    }
}