import { Redis } from "@upstash/redis";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

async function migrate() {
  // Migrate auth.json
  const authData = JSON.parse(
    fs.readFileSync(path.join("app", "data", "auth.json"), "utf-8")
  );
  await redis.set("auth", JSON.stringify(authData));
  console.log("✅ auth.json migrated!", authData.length, "users");

  // Migrate employees.json
  const empPath = path.join("app", "data", "employees.json");
  const empData = fs.existsSync(empPath)
    ? JSON.parse(fs.readFileSync(empPath, "utf-8"))
    : [];
  await redis.set("employees", JSON.stringify(empData));
  console.log("✅ employees.json migrated!", empData.length, "employees");

  console.log("🎉 Migration complete!");
}

migrate().catch(console.error);