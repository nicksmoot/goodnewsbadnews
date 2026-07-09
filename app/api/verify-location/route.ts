import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { withinCityBounds, CityKey } from "@/lib/data";

export const dynamic = "force-dynamic";

// GET /api/verify-location?city=spokane
// Reports whether the signed-in user has completed the one-time local check for
// that city.
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ verified: false, signedIn: false });
  const city = new URL(req.url).searchParams.get("city");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { verifiedCity: true, locationVerifiedAt: true },
  });
  const verified = !!user?.locationVerifiedAt && (!city || user.verifiedCity === city);
  return NextResponse.json({ verified, verifiedCity: user?.verifiedCity ?? null, signedIn: true });
}

const schema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite(),
  city: z.enum(["spokane", "honolulu"]),
});

// POST { lat, lng, city } — the browser's GPS reading. If it falls inside the
// city, the user is marked locally verified for that city (once is enough).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "We couldn't read your location. Try again." }, { status: 400 });
  }
  const { lat, lng, city } = parsed.data;
  if (!withinCityBounds(city as CityKey, lat, lng)) {
    return NextResponse.json(
      { error: `You appear to be outside ${city === "honolulu" ? "Honolulu" : "Spokane"}. You can only post in the city you're in.`, verified: false },
      { status: 422 }
    );
  }
  await prisma.user.update({
    where: { id: session.user.id },
    data: { verifiedCity: city, locationVerifiedAt: new Date() },
  });
  return NextResponse.json({ ok: true, verified: true, verifiedCity: city });
}
