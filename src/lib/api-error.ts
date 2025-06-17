export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, code?: string) {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = "Unauthorized", code?: string) {
    return new ApiError(401, message, code);
  }

  static forbidden(message = "Forbidden", code?: string) {
    return new ApiError(403, message, code);
  }

  static notFound(message = "Resource not found", code?: string) {
    return new ApiError(404, message, code);
  }

  static conflict(message: string, code?: string) {
    return new ApiError(409, message, code);
  }

  static internal(message = "Internal server error", code?: string) {
    return new ApiError(500, message, code);
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    };
  }

  // Handle Prisma errors
  if (error instanceof Error) {
    if (error.message.includes("Unique constraint")) {
      return {
        statusCode: 409,
        message: "Resource already exists",
        code: "CONFLICT",
      };
    }
  }

  // Default error
  return {
    statusCode: 500,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  };
}
