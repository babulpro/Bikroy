// src/app/api/user/Address/route.js
import { DecodedJwtToken } from "@/app/Utility/authFunction/JwtHelper";
import prisma from "@/app/Utility/prisma/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rateLimit } from "@/app/Utility/rateLimite/RateLimiter";

const addressRateLimiter = new Map();

const VALIDATION = {
  country: /^[a-zA-Z\s\-']{2,50}$/,
  city: /^[a-zA-Z\s\-']{2,50}$/,
  area: /^[a-zA-Z0-9\s\-',.]{2,100}$/,
  latitude: /^-?\d{1,3}\.\d{1,10}$/,
  longitude: /^-?\d{1,3}\.\d{1,10}$/,
};

const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '').substring(0, 100);
};

// POST - Create new address
export async function POST(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ status: "fail", msg: "Too many requests" }, { status: 429 });
        }

        const reqBody = await request.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ status: "fail", msg: "Unauthorized" }, { status: 401 });
        }

        let { area, city, state, country, latitude, longitude } = reqBody;

        // Validate required fields
        if (!area || !city || !country) {
            return NextResponse.json({ status: "fail", msg: "Area, city and country are required" }, { status: 400 });
        }

        // Sanitize inputs
        area = sanitizeInput(area);
        city = sanitizeInput(city);
        state = sanitizeInput(state);
        country = sanitizeInput(country);

        // Validate patterns
        if (!VALIDATION.country.test(country)) {
            return NextResponse.json({ status: "fail", msg: "Invalid country format" }, { status: 400 });
        }
        if (!VALIDATION.city.test(city)) {
            return NextResponse.json({ status: "fail", msg: "Invalid city format" }, { status: 400 });
        }
        if (!VALIDATION.area.test(area)) {
            return NextResponse.json({ status: "fail", msg: "Invalid area format" }, { status: 400 });
        }
        if (latitude && !VALIDATION.latitude.test(latitude)) {
            return NextResponse.json({ status: "fail", msg: "Invalid latitude format" }, { status: 400 });
        }
        if (longitude && !VALIDATION.longitude.test(longitude)) {
            return NextResponse.json({ status: "fail", msg: "Invalid longitude format" }, { status: 400 });
        }

        const decodedToken = await DecodedJwtToken(token);
        if (!decodedToken?.id) {
            return NextResponse.json({ status: "fail", msg: "Invalid token" }, { status: 401 });
        }

        const findUser = await prisma.user.findUnique({ where: { id: decodedToken.id } });
        if (!findUser) {
            return NextResponse.json({ status: "fail", msg: "User not found" }, { status: 404 });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: findUser.id,
                country,
                state: state || "",
                city,
                area,
                latitude: latitude || "",
                longitude: longitude || ""
            }
        });

        return NextResponse.json({ status: "success", msg: "Address created successfully", data: newAddress }, { status: 201 });

    } catch (error) {
        console.error('Address creation error:', error);
        return NextResponse.json({ status: "fail", msg: "Something went wrong" }, { status: 500 });
    }
}

// GET - Fetch all addresses
export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ status: "fail", msg: "Unauthorized" }, { status: 401 });
        }

        const decodedToken = await DecodedJwtToken(token);
        if (!decodedToken?.id) {
            return NextResponse.json({ status: "fail", msg: "Invalid token" }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: decodedToken.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ status: "success", data: addresses });

    } catch (error) {
        console.error('Fetch addresses error:', error);
        return NextResponse.json({ status: "fail", msg: "Something went wrong" }, { status: 500 });
    }
}

// Rate limiting helper
const requestCounts = new Map();
function checkRateLimit(ip, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const requests = requestCounts.get(ip) || [];
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) return false;
    
    validRequests.push(now);
    requestCounts.set(ip, validRequests);
    return true;
}