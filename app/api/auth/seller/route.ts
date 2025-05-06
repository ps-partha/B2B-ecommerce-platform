import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
export async function GET(req: Request) {
    try {
      const cookieStore = await cookies();
      const tokenData = cookieStore.get("seller_token");
  
      if (!tokenData?.value) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const decoded = verify(tokenData.value, process.env.JWT_SECRET as string) as any;
      if (!decoded || decoded.role !== 'SELLER') {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }
  
      return NextResponse.json({
        message: "Authenticated",
        user: {
          id: decoded.id,
          email: decoded.email
        }
      }, { status: 200 });
    } catch (error) {
      console.error("Authentication check error:", error); // Log the specific error
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}
  