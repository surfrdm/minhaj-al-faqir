import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/direct_page_edits.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const newEdits = await request.json();
    const filePath = path.join(process.cwd(), "src/data/direct_page_edits.json");

    let current = {};
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      current = JSON.parse(existing);
    } catch {
      current = {};
    }

    const merged = {
      ...current,
      ...newEdits,
    };

    await fs.writeFile(filePath, JSON.stringify(merged, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "تم حفظ التعديلات المباشرة بنجاح في الموقع!",
      count: Object.keys(merged).length,
    });
  } catch (error) {
    console.error("Error saving direct page edits:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التعديلات" },
      { status: 500 }
    );
  }
}
