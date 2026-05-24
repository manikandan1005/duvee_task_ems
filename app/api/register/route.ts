import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";

async function readAuth(): Promise<any[]> {
  const data = await redis.get("auth");
  if (!data) return [];
  return typeof data === "string" ? JSON.parse(data) : data as any[];
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const dbData = await readAuth();

    const isExist = dbData.filter((i: any) => i.username === requestData.username);
    if (isExist.length !== 0)
      return NextResponse.json({ status: false, message: "User already exist" });

    const newUser = { id: crypto.randomUUID(), ...requestData };
    dbData.push(newUser);
    await redis.set("auth", JSON.stringify(dbData));
    return NextResponse.json({ message: "User created successfully" });
  } catch (e: any) {
    return NextResponse.json({ status: false, message: e.message });
  }
}