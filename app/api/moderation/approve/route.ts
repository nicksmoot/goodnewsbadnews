import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const { signalId } = await request.json();
  if (!signalId) return NextResponse.json({ error: "signalId is required" }, { status: 400 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ signalId, status: "PUBLISHED", demo: true });

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase.from("signals").update({ status: "PUBLISHED" }).eq("id", signalId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
