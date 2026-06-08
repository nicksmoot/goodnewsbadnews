import { NextResponse } from "next/server";
import { isDemoModeEnabled } from "@/lib/demo";
import { createSupabaseServiceClient } from "@/lib/supabase";

const forbiddenPatterns = [
  /\bminor name\b/i,
  /\bmedical record\b/i,
  /\bhome address\b/i,
  /\bthreat\b/i,
  /\bkill\b/i,
  /\bsuicide\b/i,
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/
];

function validateSignal(payload: Record<string, unknown>) {
  const requiredFields = ["title", "body", "signal_type", "city_id"];
  const missing = requiredFields.filter((field) => typeof payload[field] !== "string" || !payload[field]);
  if (missing.length > 0) return `Missing required fields: ${missing.join(", ")}`;
  if (!["GOOD", "WARNING", "OPPORTUNITY"].includes(String(payload.signal_type))) {
    return "signal_type must be GOOD, WARNING, or OPPORTUNITY";
  }
  return null;
}

export async function POST(request: Request) {
  const payload = await request.json();
  const validationError = validateSignal(payload);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const body = `${payload.title ?? ""} ${payload.body ?? ""}`;
  if (forbiddenPatterns.some((pattern) => pattern.test(body))) {
    return NextResponse.json({ error: "Submission requires human safety review before payment." }, { status: 422 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (isDemoModeEnabled()) {
      return NextResponse.json({ status: "PENDING", moderationStep: "AI Review", demo: true });
    }
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("signals").insert({ ...payload, status: "PENDING" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
