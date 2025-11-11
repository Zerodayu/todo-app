import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateTodo, getTodoById } from "@/data/todos";
import { verifyJWT, unauthorizedResponse } from "@/libs/session";
import { SelectTodo } from "@/db/schema";

const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long").optional(),
  is_done: z.boolean().optional(),
}).refine(data => data.title !== undefined || data.is_done !== undefined, {
  message: "At least one field (title or is_done) must be provided",
});

export async function PATCH(
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

    const body = await request.json();
    const validatedData = updateTodoSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validatedData.error.issues },
        { status: 400 }
      );
    }

    // Check if todo exists and belongs to the user
    const existingTodo = await getTodoById(todoId) as SelectTodo | Error | undefined;

    if (!existingTodo || existingTodo instanceof Error) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingTodo.user_id !== parseInt(session.userId)) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to update this todo" },
        { status: 403 }
      );
    }

    // Update the todo
    const result = await updateTodo(todoId, validatedData.data);

    if (result instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update todo" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Todo updated successfully", 
        data: result 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH /api/todos/[id]/toggle:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
