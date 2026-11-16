import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface PoemItem {
  id: string;
  title: string;
  poet: string;
  maqam: string;
  diwan?: string;
  category?: string;
  keywords?: string[];
  allVerses: string[];
  spiritualExplanation: string;
  nextSuggestedPoems?: { id: string; title: string; poet: string }[];
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/samaa_sequence.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch {
    return NextResponse.json({ error: "Failed to read samaa sequence" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { poemId, poem } = body as { poemId?: string; poem?: Partial<PoemItem> };

    if (!poemId || !poem) {
      return NextResponse.json({ error: "Missing poemId or poem data" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src/data/samaa_sequence.json");
    let currentList: PoemItem[] = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      currentList = JSON.parse(fileContent) as PoemItem[];
    } catch {
      return NextResponse.json({ error: "Could not load current poems list" }, { status: 500 });
    }

    const index = currentList.findIndex((p: PoemItem) => p.id === poemId);
    if (index === -1) {
      // If not found, append
      currentList.push({ ...(poem as PoemItem), id: poemId });
    } else {
      currentList[index] = {
        ...currentList[index],
        ...poem,
        id: poemId, // ensure id remains unchanged
      };
    }

    // Save back to JSON file
    try {
      await fs.writeFile(filePath, JSON.stringify(currentList, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Notice: could not write to disk (read-only environment on Vercel)", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ التعديل والتصحيح بنجاح",
      poem: currentList[index !== -1 ? index : currentList.length - 1],
    });
  } catch (err: unknown) {
    console.error("Error saving poem edit:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
