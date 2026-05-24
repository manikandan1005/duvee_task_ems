import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), "app", "data", "auth.json");
const EMP_FILE  = path.join(process.cwd(), "app", "data", "employees.json");

export async function GET() {
  try {
    return NextResponse.json(JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8")));
  } catch (e: any) {
    return NextResponse.json({ status: false, message: e.message });
  }
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const authUsers = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    const employees = fs.existsSync(EMP_FILE)
      ? JSON.parse(fs.readFileSync(EMP_FILE, "utf-8"))
      : [];

    // 1. Check auth.json by username + password
    const authUser = authUsers.find(
      (u: any) => u.username === username && u.password === password
    );

    if (authUser) {
      return NextResponse.json({
        status: true,
        message: "Login Success",
        user: {
          employeeId: authUser.employeeId,  // EMP-xxx or null for admin
          username:   authUser.username,
          password:   authUser.password,
          status:     "Active",
          role:       authUser.role,
        },
      });
    }

    // 2. Not found or wrong password
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