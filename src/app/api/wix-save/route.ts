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
    const userEditsPath = path.join(process.cwd(), "src/data/user_edits.json");

    let current = {};
    try {
      const existing = await fs.readFile(userEditsPath, "utf-8");
      current = JSON.parse(existing);
    } catch {
      current = {};
    }

    const updated = {
      ...current,
      ...data,
      last_modified: new Date().toISOString(),
    };

    await fs.writeFile(userEditsPath, JSON.stringify(updated, null, 2), "utf-8");

    // If masar data is updated, write to src/data/masar.json as well
    if (data.masar && Array.isArray(data.masar.stages)) {
      const masarPath = path.join(process.cwd(), "src/data/masar.json");
      try {
        const masarRaw = await fs.readFile(masarPath, "utf-8");
        const masarJson = JSON.parse(masarRaw);

        if (data.masar.notice) {
          masarJson.meta.notice = data.masar.notice;
        }

        masarJson.stages = masarJson.stages.map((existingStage: any) => {
          const incoming = data.masar.stages.find((s: any) => s.id === existingStage.id);
          if (!incoming) return existingStage;
          return {
            ...existingStage,
            title: incoming.title ?? existingStage.title,
            duration: incoming.duration ?? existingStage.duration,
            goal: incoming.goal ?? existingStage.goal,
            practice: Array.isArray(incoming.practice) ? incoming.practice : existingStage.practice,
            review_questions: Array.isArray(incoming.review_questions) ? incoming.review_questions : existingStage.review_questions,
          };
        });

        await fs.writeFile(masarPath, JSON.stringify(masarJson, null, 2), "utf-8");
      } catch (err) {
        console.error("Error updating masar.json:", err);
      }
    }

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
