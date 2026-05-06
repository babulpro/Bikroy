// src/app/api/product//update-status/route.js
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const VALID_STATUSES = ['ACTIVE', 'HIDDEN', 'SOLD'];
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export async function PUT(request) {
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
        
        const body = await request.json();
        const { productId, status } = body;
        
        if (!productId || !status) {
            return NextResponse.json({ status: "fail", msg: "Product ID and status are required" }, { status: 400 });
        }
        
        if (!OBJECT_ID_PATTERN.test(productId)) {
            return NextResponse.json({ status: "fail", msg: "Invalid product ID format" }, { status: 400 });
        }
        
        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json({ status: "fail", msg: "Invalid status value" }, { status: 400 });
        }
        
        const product = await prisma.product.findFirst({
            where: { id: productId, userId: decoded.id },
            select: { id: true, status: true }
        });
        
        if (!product) {
            return NextResponse.json({ status: "fail", msg: "Product not found or unauthorized" }, { status: 404 });
        }
        
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: { status }
        });
        
        return NextResponse.json({
            status: "success",
            msg: `Product ${status === 'ACTIVE' ? 'activated' : status === 'HIDDEN' ? 'deactivated' : 'marked as sold'} successfully`,
            product: updatedProduct
        });
        
    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json({ status: "fail", msg: "Something went wrong" }, { status: 500 });
    }
}