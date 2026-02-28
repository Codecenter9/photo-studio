import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const referer = req.headers.get("referer");

    if (pathname.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(
          referer ? new URL(referer) : new URL("/", req.url)
        );
      }
    }
    
    if (pathname.startsWith("/client")) {
      if (token?.role !== "client") {
        return NextResponse.redirect(
          referer ? new URL(referer) : new URL("/", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};