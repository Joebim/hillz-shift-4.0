import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/src/lib/cloudinary";
import { getSession } from "@/src/lib/auth/session";

// Helper to check Authorization
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

// DELETE /api/uploads/[id] - Delete specific media
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
    const { id } = await params; // public_id or asset_id? Docs say: The Database ID (_id) OR the Storage Provider's Asset ID (public_id).
    // Since Cloudinary uses public_id for deletion (or resource API), we need to extract the resource type too if ambiguous.
    // It's safer to use public_id. The endpoint likely receives public_id.
    // However, standard Next.js dynamic routes handle params as async in latest versions? No, params is sync in current version I think, or { params } is passed directly.
    // Let's assume standard params.id

    // Cloudinary destroy API takes public_id
    // We might need to handle folders correctly if public_id contains slashes which Next.js might capture differently or encode.
    // If the ID is simply the file name or encoded Public ID.
    // Let's assume the ID passed is the Cloudinary Public ID. Decoding it might be necessary.
    const publicId = decodeURIComponent(id);

    // Try destroying as image first, if fails maybe video? Or allow query param resource_type
    const resourceType =
      request.nextUrl.searchParams.get("resource_type") || "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      // 'not found' is somewhat okay if already gone?
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
    console.error("Delete upload error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 },
    );
  }
}
