import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/user_edits.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read user edits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), "src/data/user_edits.json");

    let current = {};
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      current = JSON.parse(existing);
    } catch {
      current = {};
    }

    const updated = {
      ...current,
      ...data,
      last_modified: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "تم حفظ التعديلات بنجاح في الموقع!",
      data: updated,
    });
  } catch (error) {
    console.error("Error saving edits:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التعديلات" },
      { status: 500 }
    );
  }
}
