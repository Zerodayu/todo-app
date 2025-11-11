import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createTodo } from "@/data/todos";

// Define Zod schema for todo validation
const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  user_id: z.number().int().positive("User ID must be a positive integer"),
  is_done: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validatedData = todoSchema.parse(body);

    // Create todo in database
    const result = await createTodo(validatedData);

    // Check if result is an error
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
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Error in POST /api/todos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}