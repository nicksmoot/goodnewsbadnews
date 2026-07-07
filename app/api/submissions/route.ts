import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { scan, typeToCat, coordFor, CityKey } from "@/lib/data";

// Anyone can submit a signal (anonymous participation is part of the brief);
// signed-in users get their byline attached.
const schema = z.object({
  title: z.string().trim().min(8).max(200),
  type: z.string().max(40),
  topic: z.string().max(60),
  neighborhood: z.string().max(80),
  cross: z.string().max(120).optional().default(""),
  body: z.string().trim().min(300).max(20000),
  tags: z.string().max(300).optional().default(""),
  photo: z.string().max(3_000_000).optional().default(""),
  city: z.enum(["spokane", "honolulu"]),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Give your signal a real headline (8+ characters) and a story with substance (300+ characters)." },
      { status: 400 }
    );
  }
  const d = parsed.data;
  if (d.photo && !d.photo.startsWith("data:image/")) {
    return NextResponse.json({ error: "Photo must be an image." }, { status: 400 });
  }

  const session = await auth();
  const result = scan(d.title + " " + d.body);
  const cat = typeToCat(d.type);
  const coords = coordFor(d.city as CityKey, d.neighborhood, d.title + Math.random().toString(36).slice(2));
  const by = session?.user?.name?.trim() || "Resident";

  const sub = await prisma.submission.create({
    data: {
      userId: session?.user?.id || null,
      title: d.title,
      cat,
      topic: d.topic,
      hood: d.neighborhood,
      cross: d.cross,
      body: d.body,
      tags: (d.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5).join(","),
      photo: d.photo || "",
      by,
      city: d.city,
      lat: coords.lat,
      lng: coords.lng,
      scanLevel: result.level,
      scanMsg: result.msg,
    },
  });

  return NextResponse.json({ ok: true, id: sub.id, scanMessage: result.msg });
}
