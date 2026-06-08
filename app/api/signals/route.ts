import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

const forbiddenPatterns = [/\bminor name\b/i, /\bmedical record\b/i, /\bhome address\b/i, /\bthreat\b/i];

export async function POST(request: Request) {
  const payload = await request.json();
  const body = `${payload.title ?? ""} ${payload.body ?? ""}`;
  if (forbiddenPatterns.some((pattern) => pattern.test(body))) {
    return NextResponse.json({ error: "Submission requires human safety review before payment." }, { status: 422 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ status: "PENDING", moderationStep: "AI Review", demo: true });
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("signals").insert({ ...payload, status: "PENDING" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
