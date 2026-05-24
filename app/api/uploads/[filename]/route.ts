// app/api/uploads/[filename]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "app", "data", "uploads");

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    const filePath = path.join(UPLOAD_DIR, filename);


    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(filePath);
    const ext    = path.extname(filename).toLowerCase();
    const mime: Record<string, string> = {
      ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
      ".png": "image/png",  ".webp": "image/webp",
      ".gif": "image/gif",
    };

    return new NextResponse(buffer, {
      headers: { "Content-Type": mime[ext] ?? "image/jpeg" },
    });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}