// app/api/location/reverse-geocode/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { latitude, longitude } = reqBody;
        
        if (!latitude || !longitude) {
            return NextResponse.json(
                { status: "failed", msg: "Latitude and longitude required" },
                { status: 400 }
            );
        }
        
        // Using OpenStreetMap Nominatim API (free, no API key)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        
        const data = await response.json();
        
        if (data && data.address) {
            const address = {
                fullAddress: data.display_name,
                country: data.address.country || "",
                state: data.address.state || "",
                city: data.address.city || data.address.town || data.address.village || "",
                road: data.address.road || "",
                postcode: data.address.postcode || "",
                latitude: latitude,
                longitude: longitude
            };
            
            return NextResponse.json({
                status: "success",
                data: address
            });
        } else {
            return NextResponse.json(
                { status: "fail", msg: "Location not found" },
                { status: 404 }
            );
        }
        
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong" },
            { status: 500 }
        );
    }
}