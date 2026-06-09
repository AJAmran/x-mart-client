import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/src/services/AuthService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await refreshAccessToken();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Refresh failed" },
      { status: 401 }
    );
  }
}
