import { NextRequest, NextResponse } from "next/server";
import { getTodos } from "@/data/todos";

export async function GET() {
  try {
    const todos = await getTodos();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}