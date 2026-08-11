import { NextResponse } from "next/server";
import { createOrder } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
