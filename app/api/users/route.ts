import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  const newUser = await req.json();

  const data = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(data);

  users.push(newUser);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return NextResponse.json({ message: "User added" });
}