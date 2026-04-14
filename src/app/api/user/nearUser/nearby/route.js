// app/api/products/nearby/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { calculateDistance, formatDistance } from "@/app/Utility/location/location";

export async function POST(request) {
    try {
        // Get current user
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const decodedToken = await DecodedJwtToken(token);
        const currentUser = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            include: { address: true }
        });
        
        if (!currentUser || currentUser.address.length === 0) {
            return NextResponse.json(
                { status: "fail", msg: "User location not found" },
                { status: 404 }
            );
        }
        
        const reqBody = await request.json();
        const { radius = 10, categoryId, condition, minPrice, maxPrice } = reqBody;
        
        const userLocation = currentUser.address[0];
        
        // Get all active products with user addresses
        const products = await prisma.product.findMany({
            where: {
                status: "ACTIVE",
                ...(categoryId && { categoryId }),
                ...(condition && { condition }),
                ...(minPrice && { price: { gte: minPrice } }),
                ...(maxPrice && { price: { lte: maxPrice } })
            },
            include: {
                user: {
                    include: {
                        address: true
                    }
                },
                category: true,
                favorite: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        // Calculate distances and filter
        const nearbyProducts = products
            .map(product => {
                if (!product.user.address || product.user.address.length === 0) return null;
                
                const productLocation = product.user.address[0];
                const distance = calculateDistance(
                    parseFloat(userLocation.latitude),
                    parseFloat(userLocation.longitude),
                    parseFloat(productLocation.latitude),
                    parseFloat(productLocation.longitude)
                );
                
                return {
                    ...product,
                    distance: distance,
                    distanceFormatted: formatDistance(distance),
                    sellerLocation: productLocation
                };
            })
            .filter(product => product && product.distance <= radius)
            .sort((a, b) => a.distance - b.distance);
        
        return NextResponse.json({
            status: "success",
            data: {
                currentLocation: {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                },
                nearbyProducts: nearbyProducts,
                total: nearbyProducts.length,
                radius: radius
            }
        });
        
    } catch (error) {
        console.error("Nearby products error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong" },
            { status: 500 }
        );
    }
}