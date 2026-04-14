
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { calculateDistance, formatDistance } from "@/app/Utility/location/location";

export async function POST(request) {
    try {
        // Get current user from token
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
            include: {
                address: true
            }
        });
        
        if (!currentUser || currentUser.address.length === 0) {
            return NextResponse.json(
                { status: "fail", msg: "User location not found" },
                { status: 404 }
            );
        }
        
        // Get user's current location
        const userLocation = currentUser.address[0];
        const { latitude: userLat, longitude: userLon } = userLocation;
        
        // Get request body for custom radius
        const reqBody = await request.json();
        const { radius = 10 } = reqBody; // Default 10km radius
        
        // Get all users with addresses
        const allUsers = await prisma.user.findMany({
            where: {
                id: { not: currentUser.id } // Exclude current user
            },
            include: {
                address: true,
                product: {
                    where: { status: "ACTIVE" },
                    take: 5
                }
            }
        });
        
        // Calculate distances and filter nearby users
        const nearbyUsers = allUsers
            .map(user => {
                if (user.address.length === 0) return null;
                
                const userAddr = user.address[0];
                const distance = calculateDistance(
                    parseFloat(userLat),
                    parseFloat(userLon),
                    parseFloat(userAddr.latitude),
                    parseFloat(userAddr.longitude)
                );
                
                return {
                    ...user,
                    distance: distance,
                    distanceFormatted: formatDistance(distance),
                    address: user.address[0]
                };
            })
            .filter(user => user && user.distance <= radius)
            .sort((a, b) => a.distance - b.distance);
        
        return NextResponse.json({
            status: "success",
            data: {
                currentLocation: {
                    latitude: userLat,
                    longitude: userLon,
                    address: userLocation
                },
                nearbyUsers: nearbyUsers,
                total: nearbyUsers.length,
                radius: radius
            }
        });
        
    } catch (error) {
        console.error("Nearby users error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong" },
            { status: 500 }
        );
    }
}