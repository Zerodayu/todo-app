import { NextResponse } from "next/server";
import { getTodos } from "@/data/todos";
import { AuthenticatedRequest } from "../route";

export async function GET(request: AuthenticatedRequest) {
  try {
    const todos = await getTodos(parseInt(request.session.userId));
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}