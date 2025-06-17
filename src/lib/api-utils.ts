import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "../../prisma";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.userId) {
    throw new ApiError("Unauthorized", 401);
  }

  const user = await Prisma.user.findFirst({
    where: {
      clerkId: session.userId,
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { message: error.message, code: error.code } },
      { status: error.status }
    );
  }

  return NextResponse.json(
    { error: { message: "An unexpected error occurred" } },
    { status: 500 }
  );
}

export const successResponse = <T>(data: T, status = 200) => {
  return NextResponse.json(data, { status });
};

export const validateRequiredFields = (
  body: Record<string, any>,
  fields: string[]
) => {
  const missing = fields.filter((field) => !body[field]);
  if (missing.length > 0) {
    throw new ApiError(`Missing required fields: ${missing.join(", ")}`, 400);
  }
};
