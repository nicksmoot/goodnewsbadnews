import { NextResponse } from "next/server";

export function requireAdminRequest(request: Request) {
  const expectedToken = process.env.ADMIN_API_TOKEN;
  if (!expectedToken) {
    return NextResponse.json({ error: "ADMIN_API_TOKEN is not configured" }, { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined;
  const headerToken = request.headers.get("x-admin-token") ?? undefined;

  if (bearerToken !== expectedToken && headerToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
