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
  
  if (!accessToken && refreshToken) {
    try {
      const newSession = await refreshSession(refreshToken);

      if (newSession?.accessToken) {
        const response = NextResponse.next();

        response.cookies.set("accessToken", newSession.accessToken, {
          httpOnly: true,
          path: "/",
        });

        isAuthenticated = true;

        return response;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};