import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail } from '@/data/users';

const getUserSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function GET(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = getUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    const user = await getUserByEmail(email);

    if (user instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch user',
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while fetching user',
      },
      { status: 500 }
    );
  }
}