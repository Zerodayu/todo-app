import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcrypt-ts';
import { createUser } from '@/data/users';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validatedData.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(validatedData.data.password, 10);

    const newUser = await createUser({
      name: validatedData.data.name,
      email: validatedData.data.email,
      password: hashedPassword,
    });

    if (newUser instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create user',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          email: validatedData.data.email,
          name: validatedData.data.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during registration',
      },
      { status: 500 }
    );
  }
}
