// src/app/Utility/authFunction/JwtHelper.js
import { jwtVerify, SignJWT } from "jose";

// Use environment variable for secret, not hardcoded
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

export async function CreateJwtToken(role, id, email = null) {
    let token = await new SignJWT({ 
        role, 
        id,
        email,
        issuedAt: Date.now()
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER || "sellkoro.com")
    .setAudience('sellkoro-users')
    .setExpirationTime("7d") // 7 days
    .sign(SECRET_KEY);

    return token;
}

export async function DecodedJwtToken(token) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY, {
            issuer: process.env.JWT_ISSUER || "sellkoro.com",
            audience: 'sellkoro-users'
        });
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

// Helper to check if token is expired
export async function isTokenExpired(token) {
    const decoded = await DecodedJwtToken(token);
    if (!decoded) return true;
    return decoded.exp && decoded.exp < Date.now() / 1000;
}

// Helper to get user role from token
export async function getUserRole(token) {
    const decoded = await DecodedJwtToken(token);
    return decoded?.role || null;
}