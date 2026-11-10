import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import zlib from "zlib";

const MAX_CACHED_DATASETS = 8;
const hizbMemoryCache = new Map<string, unknown>();

function getCachedOrReadHizb(hizbNum: number, script: string | null): unknown | null {
  const isMohammadi = script === "mohammadi";
  const cacheKey = `${isMohammadi ? "m6" : "std"}:${hizbNum}`;

  const cached = hizbMemoryCache.get(cacheKey);
  if (cached) {
    hizbMemoryCache.delete(cacheKey);
    hizbMemoryCache.set(cacheKey, cached);
    return cached;
  }

  let parsed: unknown | null = null;
  if (isMohammadi) {
    const m6Path = path.join(
      process.cwd(),
      "src",
      "data",
      "ahzab_m6",
      `hizb_${hizbNum}.json.gz`
    );
    if (!fs.existsSync(m6Path)) {
      return null;
    }
    const raw = zlib.gunzipSync(fs.readFileSync(m6Path)).toString("utf-8");
    parsed = JSON.parse(raw);
  } else {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "ahzab",
      `hizb_${hizbNum}.json`
    );
    if (!fs.existsSync(filePath)) {
      return null;
    }
    parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  if (hizbMemoryCache.size >= MAX_CACHED_DATASETS) {
    const oldestKey = hizbMemoryCache.keys().next().value;
    if (oldestKey !== undefined) {
      hizbMemoryCache.delete(oldestKey);
    }
  }
  hizbMemoryCache.set(cacheKey, parsed);
  return parsed;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hizbNum = parseInt(id, 10);

    if (isNaN(hizbNum) || hizbNum < 1 || hizbNum > 60) {
      return NextResponse.json(
        { error: "Invalid hizb number. Must be between 1 and 60." },
        { status: 400 }
      );
    }

    const script = request.nextUrl.searchParams.get("script");
    const hizbData = getCachedOrReadHizb(hizbNum, script);

    if (!hizbData) {
      return NextResponse.json({ error: "Hizb not found" }, { status: 404 });
    }

    return NextResponse.json(hizbData, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
