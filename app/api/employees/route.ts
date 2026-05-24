import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";
import { put } from "@vercel/blob";

async function readStore(): Promise<any[]> {
  const data = await redis.get("employees");
  if (!data) return [];
  return typeof data === "string" ? JSON.parse(data) : data as any[];
}

async function saveStore(store: any[]) {
  await redis.set("employees", JSON.stringify(store));
}

async function saveImage(file: File): Promise<string> {
  const ext  = file.name.split(".").pop() || "jpg";
  const name = `${Date.now()}.${ext}`;
  const blob = await put(name, file, { access: "public" });
  return blob.url;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const store = await readStore();
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

    const store = await readStore();
    store.push(employee);
    await saveStore(store);
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

    const store = await readStore();
    const index = store.findIndex((e: any) => e.employeeId === employeeId);
    if (index === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const imgFile = fd.get("profileImage") as File | null;
    const profileImage = imgFile && imgFile.size > 0
      ? await saveImage(imgFile)
      : store[index].profileImage ?? "";

    store[index] = {
      ...store[index],
      ...Object.fromEntries(fd.entries()),
      profileImage,
      password:         store[index].password,
      skills:           json("skills"),
      emergencyContact: json("emergencyContact"),
      education:        json("education"),
      bankDetails:      json("bankDetails"),
      documents:        json("documents"),
      updatedAt:        new Date().toISOString(),
    };

    await saveStore(store);
    return NextResponse.json({ message: "Employee updated", data: store[index] });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { employeeId } = await req.json();
    const store = await readStore();
    const newData = store.filter((e: any) => e.employeeId !== employeeId);
    await saveStore(newData);
    return NextResponse.json({ message: "Employee removed" });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}