import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE  = path.join(process.cwd(), "app", "data", "employees.json");
const UPLOAD_DIR = path.join(process.cwd(), "app", "data", "uploads"); // ← inside app/data

function readStore() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, "[]");
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
  return raw ? JSON.parse(raw) : [];
}

async function saveImage(file: File): Promise<string> {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext  = path.extname(file.name) || ".jpg";
  const name = `${Date.now()}${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${name}`; // ← served via API route
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const store = readStore();
    if (id) {
      const emp = store.find((e: any) => e.employeeId === id);
      if (!emp) return NextResponse.json({ message: "Not found" }, { status: 404 });
      return NextResponse.json(emp);
    }
    return NextResponse.json(store);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const fd   = await req.formData();
    const json = (k: string) => { try { return JSON.parse(fd.get(k) as string); } catch { return {}; } };

    const imgFile = fd.get("profileImage") as File | null;
    const profileImage = imgFile && imgFile.size > 0 ? await saveImage(imgFile) : "";

    const employee = {
      employeeId: `EMP-${Date.now()}`,
      ...Object.fromEntries(fd.entries()),
      profileImage,
      password:         "Duve@123",
      skills:           json("skills"),
      emergencyContact: json("emergencyContact"),
      education:        json("education"),
      bankDetails:      json("bankDetails"),
      documents:        json("documents"),
    };

    const store = readStore();
    store.push(employee);
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    return NextResponse.json({ message: "Employee added", data: employee }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const fd   = await req.formData();
    const json = (k: string) => { try { return JSON.parse(fd.get(k) as string); } catch { return {}; } };
    const employeeId = fd.get("employeeId") as string;

    const store = readStore();
    const index = store.findIndex((e: any) => e.employeeId === employeeId);
    if (index === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

    console.log("PUT keys in FormData:", Array.from(fd.keys()));
    const imgFile = fd.get("profileImage") as File | null;
    console.log("PUT imgFile details:", imgFile ? { name: imgFile.name, size: imgFile.size, type: imgFile.type } : "null");
    
    const profileImage = imgFile && imgFile.size > 0
      ? await saveImage(imgFile)
      : store[index].profileImage ?? "";

    store[index] = {
      ...store[index],
      ...Object.fromEntries(fd.entries()),
      profileImage,                        // ← override after spread
      password:         store[index].password,
      skills:           json("skills"),
      emergencyContact: json("emergencyContact"),
      education:        json("education"),
      bankDetails:      json("bankDetails"),
      documents:        json("documents"),
      updatedAt:        new Date().toISOString(),
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    return NextResponse.json({ message: "Employee updated", data: store[index] });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { employeeId } = await req.json();
    const newData = readStore().filter((e: any) => e.employeeId !== employeeId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    return NextResponse.json({ message: "Employee removed" });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}