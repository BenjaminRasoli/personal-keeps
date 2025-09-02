import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tmdbId = searchParams.get("tmdbId");
  const type = searchParams.get("type");

  if (!tmdbId || !type) {
    return NextResponse.json(
      { error: "Missing tmdbId or type" },
      { status: 400 }
    );
  }

  const url =
    type === "movie"
      ? `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      : `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch TMDB data" },
      { status: 500 }
    );
  }
}
