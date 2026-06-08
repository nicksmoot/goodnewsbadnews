import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin";
import { createSupabaseServiceClient } from "@/lib/supabase";

const allowedStatuses = new Set(["PUBLISHED", "REJECTED", "RESOLVED"]);

export async function POST(request: Request) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const { signalId, status = "PUBLISHED", moderatorNote } = await request.json();
  if (!signalId) return NextResponse.json({ error: "signalId is required" }, { status: 400 });
  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "status must be PUBLISHED, REJECTED, or RESOLVED" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  const update = moderatorNote ? { status, moderator_note: moderatorNote } : { status };
  const { data, error } = await supabase.from("signals").update(update).eq("id", signalId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
