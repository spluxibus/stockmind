export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class FMPError extends AppError {
  constructor(message: string, statusCode = 500) {
    super(message, "FMP_ERROR", statusCode);
    this.name = "FMPError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "API rate limit reached. Please try again later.") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

export class GeminiError extends AppError {
  constructor(message: string) {
    super(message, "GEMINI_ERROR", 500);
    this.name = "GeminiError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toApiError(error: unknown): { error: string; code: string } {
  if (error instanceof AppError) {
    return { error: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { error: error.message, code: "UNKNOWN_ERROR" };
  }
  return { error: "An unexpected error occurred", code: "UNKNOWN_ERROR" };
}
