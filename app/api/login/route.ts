// app/api/login/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonFileData = path.join(
  process.cwd(),
  "app",
  "data",
  "auth.json"
);

// GET USERS
export async function GET() {
  try {
    const fileData = fs.readFileSync(jsonFileData, "utf-8");
    const data = JSON.parse(fileData);

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({
      status: false,
      message: error.message,
    });
  }
}

// LOGIN
export async function POST(req: Request) {
  try {

    const reqData = await req.json();

    const fileData = fs.readFileSync(jsonFileData, "utf-8");

    const dbData = fileData ? JSON.parse(fileData) : [];

    // Find user
    const user = dbData.find(
      (i: any) => i.username === reqData.username
    );

    // Username check
    if (!user) {
      return NextResponse.json({
        status: false,
        message: "User not found",
      });
    }

    // Password check
    if (user.password !== reqData.password) {
      return NextResponse.json({
        status: false,
        message: "Invalid password",
      });
    }

    // Success
    return NextResponse.json({
      status: true,
      message: "Login Success",
      user,
    });

  } catch (error: any) {

    return NextResponse.json({
      status: false,
      message: error.message,
    });

  }
}