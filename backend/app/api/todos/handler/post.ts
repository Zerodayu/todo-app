import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createTodo } from "@/data/todos";
import { verifyJWT, unauthorizedResponse } from "@/libs/session";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  is_done: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const session = await verifyJWT(request);
  
  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const validatedData = todoSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validatedData.error.issues },
        { status: 400 }
      );
    }
    
    // Add user_id from the authenticated session
    const todoData = {
      ...validatedData.data,
      user_id: parseInt(session.userId),
    };
    
    const result = await createTodo(todoData);

    if (result instanceof Error) {
      return NextResponse.json(
        { error: "Failed to create todo" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Todo created successfully", data: result },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error },
        { status: 400 }
      );
    }

    console.error("Error in POST /api/todos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}