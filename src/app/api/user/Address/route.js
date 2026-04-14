// src/app/api/address/route.js
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// POST - Create new address
export async function POST(request) {
    try {
        const reqBody = await request.json(); 
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Unauthorized" }, 
                { status: 401 }
            );
        }

        const { area, city, state, country, latitude, longitude } = reqBody;

        // Validate required fields
        if (!area || !city || !country) {
            return NextResponse.json(
                { status: "fail", msg: "Please fill all required fields (area, city, country)" }, 
                { status: 400 }
            );
        }

        const decodedToken = await DecodedJwtToken(token);
        
        if (!decodedToken || !decodedToken.id) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid token" }, 
                { status: 401 }
            );
        }

        const findUser = await prisma.user.findUnique({
            where: {
                id: decodedToken.id
            }
        });

        if (!findUser) {
            return NextResponse.json(
                { status: "fail", msg: "User not found" }, 
                { status: 404 }
            );
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: findUser.id,
                country: country,
                state: state || "",
                city: city,
                area: area,
                latitude: latitude || "",
                longitude: longitude || ""
            }
        });

        return NextResponse.json(
            { 
                status: "success", 
                msg: "Address created successfully", 
                data: newAddress 
            }, 
            { status: 201 }
        );

    } catch (error) {
        console.error('Address creation error:', error);
        return NextResponse.json(
            { status: "fail", msg: error.message || "Something went wrong" }, 
            { status: 500 }
        );
    }
}

// GET - Fetch all addresses for the logged-in user
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
        
        if (!decodedToken || !decodedToken.id) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid token" }, 
                { status: 401 }
            );
        }

        const addresses = await prisma.address.findMany({
            where: {
                userId: decodedToken.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            status: "success",
            data: addresses
        });

    } catch (error) {
        console.error('Fetch addresses error:', error);
        return NextResponse.json(
            { status: "fail", msg: error.message || "Something went wrong" }, 
            { status: 500 }
        );
    }
}