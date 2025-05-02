import { NextResponse } from "next/server"

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
  }

  if (message) {
    response.message = message
  }

  return NextResponse.json(response, { status })
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}
