import { NextRequest, NextResponse } from "next/server";
import { deleteTodo, getTodoById } from "@/data/todos";
import { verifyJWT, unauthorizedResponse } from "@/libs/session";
import { SelectTodo } from "@/db/schema";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyJWT(request);
  
  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const todoId = parseInt(id);

    if (isNaN(todoId)) {
      return NextResponse.json(
        { error: "Invalid todo ID" },
        { status: 400 }
      );
    }

    // Check if todo exists and belongs to the user
    const existingTodo = await getTodoById(todoId, parseInt(session.userId)) as SelectTodo | Error | null | undefined;

    if (!existingTodo || existingTodo instanceof Error) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    // Verify ownership (already handled in getTodoById, but keeping for clarity)
    if (existingTodo.user_id !== parseInt(session.userId)) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to delete this todo" },
        { status: 403 }
      );
    }

    const result = await deleteTodo(todoId, parseInt(session.userId));

    if (result instanceof Error || result === null) {
      return NextResponse.json(
        { error: "Failed to delete todo" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/todos/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}