import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const { country } = params;

  const url = `https://cold-hill-2663.fabiangarciadelabarra.workers.dev/${country}`;
  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
