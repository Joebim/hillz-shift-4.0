import { NextResponse } from "next/server";
import { ApiResponse, ApiError } from "@/src/types/api";

/**
 * Create a success API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

/**
 * Create an error API response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
  status: number = 400,
): NextResponse<ApiResponse> {
  const error: ApiError = { code, message, details };
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  );
}

/**
 * Create an unauthorized response (401)
 */
export function unauthorizedResponse(
  message: string = "Unauthorized",
): NextResponse<ApiResponse> {
  return errorResponse("UNAUTHORIZED", message, null, 401);
}

/**
 * Create a forbidden response (403)
 */
export function forbiddenResponse(
  message: string = "Forbidden",
): NextResponse<ApiResponse> {
  return errorResponse("FORBIDDEN", message, null, 403);
}

/**
 * Create a not found response (404)
 */
export function notFoundResponse(
  message: string = "Resource not found",
): NextResponse<ApiResponse> {
  return errorResponse("NOT_FOUND", message, null, 404);
}

/**
 * Create a validation error response (400)
 */
export function validationErrorResponse(
  details: unknown,
): NextResponse<ApiResponse> {
  return errorResponse("VALIDATION_ERROR", "Validation failed", details, 400);
}

/**
 * Create a server error response (500)
 */
export function serverErrorResponse(
  message: string = "Internal server error",
): NextResponse<ApiResponse> {
  return errorResponse("SERVER_ERROR", message, null, 500);
}
