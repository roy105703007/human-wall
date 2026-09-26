import { NextResponse } from "next/server";
import { listMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listMessages());
}
