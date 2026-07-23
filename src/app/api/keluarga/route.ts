import { NextResponse } from "next/server";
import { createKeluargaWithMembers } from "@/lib/keluarga-write-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createKeluargaWithMembers(body);

    console.log("========== HASIL SERVICE ==========");
    console.dir(result, { depth: null });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: String(err),
      },
      {
        status: 500,
      }
    );
  }
}