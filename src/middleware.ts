import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// List of public routes (no authentication required)
const publicRoutes = [
  '/',
  '/register',
  '/api/auth',
  '/api/auth/',
  '/api/auth/callback',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/session',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/error',
  '/favicon.ico',
  '/_next',
  '/_next/',
  '/_next/static',
  '/_next/image',
  '/_next/data',
  '/robots.txt',
  '/manifest.json',
  '/favicon.ico',
  '/sitemap.xml',
  '/api/public',
];

export default withAuth({
  callbacks: {
    authorized: async ({ req }) => {
      const { pathname } = req.nextUrl;
      // Allow all public routes
      if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
        return true;
      }
      // For non-public routes, require authentication
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      return !!token;
    }
  }
});

export const config = {
  matcher: ['/((?!_next|api/auth|favicon.ico|robots.txt|manifest.json|sitemap.xml).*)'],
};
