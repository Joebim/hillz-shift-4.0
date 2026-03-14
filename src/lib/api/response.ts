import { NextResponse } from "next/server";
import { ApiResponse, ApiError } from "@/src/types/api";

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

export function unauthorizedResponse(
  message: string = "Unauthorized",
): NextResponse<ApiResponse> {
  return errorResponse("UNAUTHORIZED", message, null, 401);
}

export function forbiddenResponse(
  message: string = "Forbidden",
): NextResponse<ApiResponse> {
  return errorResponse("FORBIDDEN", message, null, 403);
}

export function notFoundResponse(
  message: string = "Resource not found",
): NextResponse<ApiResponse> {
  return errorResponse("NOT_FOUND", message, null, 404);
}

export function validationErrorResponse(
  details: unknown,
): NextResponse<ApiResponse> {
  return errorResponse("VALIDATION_ERROR", "Validation failed", details, 400);
}

export function serverErrorResponse(
  message: string = "Internal server error",
): NextResponse<ApiResponse> {
  return errorResponse("SERVER_ERROR", message, null, 500);
}
