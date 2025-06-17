import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) response.message = message;
  return NextResponse.json(response, { status });
}

export function errorResponse(error: string, status = 400): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return NextResponse.json(response, { status });
}

export function unauthorizedResponse(): NextResponse {
  return errorResponse("Unauthorized", 401);
}

export function notFoundResponse(message = "Resource not found"): NextResponse {
  return errorResponse(message, 404);
}

export function serverErrorResponse(error: unknown): NextResponse {
  console.error("Server error:", error);
  return errorResponse("Internal server error", 500);
}
