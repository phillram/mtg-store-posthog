import { NextRequest, NextResponse } from "next/server";
import { getRandomCards } from "@/lib/scryfall";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const setCode = searchParams.get("set");

  try {
    const cards = await getRandomCards(10, setCode || undefined);

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
