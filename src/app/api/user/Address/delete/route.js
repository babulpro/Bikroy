// src/app/api/user/Address/delete/route.js
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// DELETE - Delete address
export async function DELETE(request,response) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        console.log('Address ID to delete:', id);
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" }, 
                { status: 401 }
            );
        }

        const decodedToken = await DecodedJwtToken(token);
        
        if (!decodedToken || !decodedToken.id) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid token" }, 
                { status: 401 }
            );
        }

        // Check if address exists and belongs to user
        const existingAddress = await prisma.address.findFirst({
            where: {
                id: id,
                userId: decodedToken.id
            }
        });

        if (!existingAddress) {
            return NextResponse.json(
                { status: "fail", msg: "Address not found" }, 
                { status: 404 }
            );
        }

        await prisma.address.delete({
            where: { id: id }
        });

        return NextResponse.json({
            status: "success",
            msg: "Address deleted successfully"
        });

    } catch (error) {
        console.error('Delete address error:', error);
        return NextResponse.json(
            { status: "fail", msg: error.message || "Something went wrong" }, 
            { status: 500 }
        );
    }
}