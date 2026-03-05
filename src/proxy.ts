import { NextRequest, NextResponse } from "next/server";
import { TOKEN } from "./lib/shared/constants/tokens";
import { APP_PATHS } from "./lib/shared/constants/app-paths";

export async function proxy(req: NextRequest) {
  const { pathname } = new URL(req.url);
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith(".")
  ) {
    return NextResponse.next();
  }
  const token = req.cookies.get(TOKEN.ACCESS_TOKEN)?.value;
  const isPublicPath = pathname === APP_PATHS.LOGIN;

  if (!token && !isPublicPath) {
    const loginUrl = new URL(APP_PATHS.LOGIN, req.url);
    loginUrl.searchParams.set(APP_PATHS.REDIRECT, pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicPath) {
    const redirectParam = req.nextUrl.searchParams.get(APP_PATHS.REDIRECT);
    const redirectUrl = new URL(redirectParam ||APP_PATHS.MAIN, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
