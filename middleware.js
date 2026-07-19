import { NextResponse } from "next/server";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const loggedIn = await isValidSessionToken(token);

  // Protect the admin dashboard UI
  if (pathname.startsWith("/admin/dashboard") && !loggedIn) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect write operations on the posts API (create/update/delete)
  const isWrite = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);
  if (pathname.startsWith("/api/posts") && isWrite && !loggedIn) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/posts/:path*"],
};
