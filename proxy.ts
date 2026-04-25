import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { refreshSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

function applyCookies(
  response: NextResponse,
  cookies: { name: string; value: string }[]
) {
  cookies.forEach(({ name, value }) => {
    response.cookies.set(name, value, {
      httpOnly: true,
      path: "/",
    });
  });

  return response;
}

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

  const newCookies: { name: string; value: string }[] = [];

  //refresh session

  if (!accessToken && refreshToken) {
    try {
      const newSession = await refreshSession(refreshToken);
      if (newSession?.accessToken) {
        newCookies.push({
          name: "accessToken",
          value: newSession.accessToken,
        });

        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }
  //private routes protection
  if (isPrivateRoute && !isAuthenticated) {
     const redirect = NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
     return applyCookies(redirect, newCookies);
  }
  // auth routes redirect
  if (isAuthRoute && isAuthenticated) {
     const redirect = NextResponse.redirect(
      new URL("/", request.url)
    );
    return applyCookies(redirect, newCookies);
  }

   const response = NextResponse.next();
  return applyCookies(response, newCookies);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};