// app/api/user/location/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const decodedToken = await DecodedJwtToken(token);
        
        // Get user with address
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            include: {
                address: true,
                product: {
                    where: { status: "ACTIVE" }
                }
            }
        });
        
        if (!user) {
            return NextResponse.json(
                { status: "fail", msg: "User not found" },
                { status: 404 }
            );
        }
        
        // Get stats about user's location
        const locationStats = {
            addresses: user.address,
            totalAddresses: user.address.length,
            mainAddress: user.address[0] || null,
            productsInThisArea: user.product.length,
            coordinates: user.address[0] ? {
                lat: parseFloat(user.address[0].latitude),
                lng: parseFloat(user.address[0].longitude)
            } : null
        };
        
        return NextResponse.json({
            status: "success",
            data: locationStats
        });
        
    } catch (error) {
        console.error("Location fetch error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong" },
            { status: 500 }
        );
    }
}