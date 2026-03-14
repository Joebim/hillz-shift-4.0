import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/src/lib/cloudinary";
import { getSession } from "@/src/lib/auth/session";

async function checkAuth() {
  const session = await getSession();
  if (
    !session ||
    !["super_admin", "admin", "moderator", "editor"].includes(session.role)
  ) {
    return false;
  }
  return true;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params; 
    
    const publicId = decodeURIComponent(id);

    const resourceType =
      request.nextUrl.searchParams.get("resource_type") || "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete from Cloudinary: " + result.result,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}
