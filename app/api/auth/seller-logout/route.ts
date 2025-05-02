import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  // Remove the cookie by setting it to empty and expired
  response.cookies.set({
    name: "seller_token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
