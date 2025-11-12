import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, unauthorizedResponse, UserSession } from "@/libs/session";

import { GET as GetHandler } from './handler/get';
import { POST as PostHandler } from './handler/post';

export interface AuthenticatedRequest extends NextRequest {
  session: UserSession;
}

function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const session = await verifyJWT(request);

    if (!session) {
      return unauthorizedResponse();
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.session = session;

    return handler(authenticatedRequest);
  };
}

export const GET = withAuth(GetHandler);
export const POST = withAuth(PostHandler);