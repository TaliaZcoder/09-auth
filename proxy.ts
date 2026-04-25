import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { refreshSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  let isAuthenticated = Boolean(accessToken);

  const response = NextResponse.next();
  
  //refresh session

  if (!accessToken && refreshToken) {
    try {
      const newSession = await refreshSession(refreshToken);
      if (newSession) {
        //access token
        if (newSession.accessToken) {
            response.cookies.set("accessToken", newSession.accessToken, {
              httpOnly: true,
              path: "/",
            });
           }
        
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }
  //private routes protection
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }
  // auth routes redirect
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};