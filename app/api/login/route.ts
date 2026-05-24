import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";

async function readAuth(): Promise<any[]> {
  const data = await redis.get("auth");
  if (!data) return [];
  return typeof data === "string" ? JSON.parse(data) : data as any[];
}

async function readEmployees(): Promise<any[]> {
  const data = await redis.get("employees");
  if (!data) return [];
  return typeof data === "string" ? JSON.parse(data) : data as any[];
}

export async function GET() {
  try {
    return NextResponse.json(await readAuth());
  } catch (e: any) {
    return NextResponse.json({ status: false, message: e.message });
  }
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const authUsers = await readAuth();
    const employees = await readEmployees();

    const authUser = authUsers.find(
      (u: any) => u.username === username && u.password === password
    );

    if (authUser) {
      return NextResponse.json({
        status: true,
        message: "Login Success",
        user: {
          employeeId: authUser.employeeId,
          username:   authUser.username,
          password:   authUser.password,
          status:     "Active",
          role:       authUser.role,
        },
      });
    }

    const exists = authUsers.some((u: any) => u.username === username)
                || employees.some((e: any) => e.email === username);

    return NextResponse.json({
      status: false,
      message: exists ? "Invalid password" : "User not found",
    });
  } catch (e: any) {
    return NextResponse.json({ status: false, message: e.message });
  }
}