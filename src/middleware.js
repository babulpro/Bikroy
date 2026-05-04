// src/middleware.js
import { NextResponse } from 'next/server';
import { DecodedJwtToken } from './app/Utility/authFunction/JwtHelper';

// ============================================
// 1. SECURITY CONFIGURATION
// ============================================

// Security headers to add to all responses
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// CSRF protected methods
const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// ============================================
// 2. ROUTE DEFINITIONS
// ============================================

// Routes that ANY logged-in user can access
const protectedRoutes = [
  '/api/admin',
  '/api/upload',
  '/api/message',
  '/api/products',
  '/api/address',
  '/api/user/update-profile',
  '/api/user/update-password',
  '/api/user/myProducts',
  '/api/product/allProduct/newProduct',
  '/api/product/update-product',
  '/api/product/delete-product',
  '/api/product/update-status',
];

// Routes that ONLY ADMINS can access
const adminRoutes = [
  '/api/admin/category/addCategory',
  '/api/admin/category/updateCategory',
  '/api/admin/category/deleteCategory',
];

// Routes that are PUBLIC (no login needed)
const publicRoutes = [
  '/api/category/getCategory',
  '/api/product/all-products',
  '/api/product/allProduct/productById',
  '/api/product/allProduct/productByCategory',
  '/api/product/allProduct/featured-products',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
];

// Frontend pages that need login
const protectedPages = [
  '/pages/user/profile',
  '/pages/user/myProducts',
  '/pages/user/address',
  '/pages/user/messages',
  '/pages/user/favorites',
  '/pages/product/item/addProduct',
  '/pages/product/edit',
];

// Admin only frontend pages
const adminPages = [
  '/pages/admin',
  '/pages/admin/categories',
];

// ============================================
// 3. HELPER FUNCTIONS
// ============================================

const matchesAny = (pathname, routes) => {
  return routes.some(route => pathname.startsWith(route));
};

const isStaticFile = (pathname) => {
  const extensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf'];
  return extensions.some(ext => pathname.endsWith(ext));
};

// CSRF Token validation (optional - implement if you add CSRF tokens)
const validateCsrfToken = (request) => {
  // For now, just log if CSRF token is missing (optional implementation)
  const csrfToken = request.headers.get('x-csrf-token');
  const method = request.method;
  
  if (CSRF_PROTECTED_METHODS.includes(method)) {
    // In production, validate the CSRF token here
    // For now, we'll just add a warning header
    return true;
  }
  return true;
};

// Rate limiting (in-memory - for production, use Redis)
const rateLimiter = new Map();

const checkRateLimit = (key, maxRequests = 30, windowMs = 60000) => {
  const now = Date.now();
  const requests = rateLimiter.get(key) || [];
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimiter.set(key, validRequests);
  
  setTimeout(() => {
    const current = rateLimiter.get(key);
    if (current && current.length === validRequests.length) {
      rateLimiter.delete(key);
    }
  }, windowMs);
  
  return true;
};

// ============================================
// 4. MAIN MIDDLEWARE FUNCTION
// ============================================

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  // ========== SKIP STATIC FILES ==========
  if (isStaticFile(pathname) || pathname.includes('/_next') || pathname.includes('/favicon.ico')) {
    return NextResponse.next();
  }

  // ========== ADD SECURITY HEADERS ==========
  const addSecurityHeaders = (response) => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  };

  // ========== API ROUTE HANDLING ==========
  if (pathname.startsWith('/api/')) {
    
    // Apply rate limiting (stricter for auth routes)
    const isAuthRoute = matchesAny(pathname, ['/api/auth/login', '/api/auth/register']);
    const maxRequests = isAuthRoute ? 5 : 30;
    const rateLimitKey = `${ip}-${pathname}`;
    
    if (!checkRateLimit(rateLimitKey, maxRequests)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Too many requests. Please try again later.', code: 'RATE_LIMIT_001' },
          { status: 429 }
        )
      );
    }
    
    // Validate CSRF for non-GET requests
    if (method !== 'GET' && !validateCsrfToken(request)) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Invalid CSRF token', code: 'CSRF_001' },
          { status: 403 }
        )
      );
    }
    
    // 1. PUBLIC ROUTES
    if (matchesAny(pathname, publicRoutes)) {
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }
    
    // 2. PROTECTED ROUTES - Need valid token
    try {
      const token = request.cookies.get('token');
      
      if (!token || !token.value) {
        return addSecurityHeaders(
          NextResponse.json(
            { error: 'Please login first', code: 'AUTH_001' },
            { status: 401 }
          )
        );
      }
      
      const user = await DecodedJwtToken(token.value);
      
      if (!user || !user.id) {
        return addSecurityHeaders(
          NextResponse.json(
            { error: 'Invalid or expired token', code: 'AUTH_002' },
            { status: 401 }
          )
        );
      }
      
      // Check token expiration
      if (user.exp && user.exp < Date.now() / 1000) {
        return addSecurityHeaders(
          NextResponse.json(
            { error: 'Token expired. Please login again.', code: 'AUTH_003' },
            { status: 401 }
          )
        );
      }
      
      // 3. ADMIN ROUTES
      if (matchesAny(pathname, adminRoutes)) {
        if (user.role !== 'Admin') {
          return addSecurityHeaders(
            NextResponse.json(
              { error: 'Admin access required', code: 'AUTH_004' },
              { status: 403 }
            )
          );
        }
      }
      
      // 4. PROTECTED ROUTES - Valid user
      if (matchesAny(pathname, protectedRoutes)) {
        // Check if user has valid role
        const validRoles = ['User', 'Admin', 'Moderator'];
        if (!user.role || !validRoles.includes(user.role)) {
          return addSecurityHeaders(
            NextResponse.json(
              { error: 'Invalid user role', code: 'AUTH_005' },
              { status: 403 }
            )
          );
        }
        
        // Add user info to headers for API to use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', user.id);
        requestHeaders.set('x-user-role', user.role);
        requestHeaders.set('x-user-authenticated', 'true');
        
        const response = NextResponse.next({
          request: { headers: requestHeaders }
        });
        return addSecurityHeaders(response);
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Authentication failed', code: 'AUTH_008' },
          { status: 401 }
        )
      );
    }
  }
  
  // ========== FRONTEND PAGE HANDLING ==========
  
  // Admin pages protection
  if (matchesAny(pathname, adminPages)) {
    const token = request.cookies.get('token');
    
    if (!token || !token.value) {
      const loginUrl = new URL('/pages/user/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const user = await DecodedJwtToken(token.value);
    if (!user || !user.id || user.role !== 'Admin') {
      // Redirect non-admin users to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Protected pages (requires login)
  if (matchesAny(pathname, protectedPages)) {
    const token = request.cookies.get('token');
    
    if (!token || !token.value) {
      const loginUrl = new URL('/pages/user/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    const user = await DecodedJwtToken(token.value);
    if (!user || !user.id) {
      const loginUrl = new URL('/pages/user/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// ============================================
// 5. CONFIGURATION
// ============================================

export const config = {
  matcher: [
    '/api/:path*',
    '/pages/:path*',
    '/admin/:path*',
  ],
};