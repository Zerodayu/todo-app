import { NextRequest, NextResponse } from "next/server";
import { getTodos } from "@/data/todos";
import { verifyJWT, unauthorizedResponse } from "@/libs/session";

export async function GET(request: NextRequest) {
  const session = await verifyJWT(request);
  
  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const todos = await getTodos(parseInt(session.userId));
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}