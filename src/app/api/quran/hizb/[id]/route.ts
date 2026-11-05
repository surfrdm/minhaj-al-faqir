import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
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

    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "ahzab",
      `hizb_${hizbNum}.json`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Hizb not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const hizbData = JSON.parse(fileContent);

    return NextResponse.json(hizbData, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error", message: err.message },
      { status: 500 }
    );
  }
}
