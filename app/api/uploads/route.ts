import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/src/lib/cloudinary";
import { getSession } from "@/src/lib/auth/session";

export interface CloudinaryResource {
  asset_id: string;
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  resource_type: string;
  width: number;
  height: number;
  created_at: string;
  folder?: string;
}

// Helper to check Authorization
async function checkAuth() {
  const session = await getSession();
  // Assuming any logged-in user (or specific roles) can upload. Or just admin.
  if (
    !session ||
    !["super_admin", "admin", "moderator", "editor"].includes(session.role)
  ) {
    return false;
  }
  return true;
}

// GET /api/uploads - List all media
export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    const next_cursor = searchParams.get("next_cursor") || undefined;
    const resource_type = searchParams.get("resource_type") || "image";

    // Use Cloudinary Admin API or Search API
    // Listing resources
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder, // rudimentary folder filtering
      max_results: limit,
      next_cursor: next_cursor,
      resource_type: resource_type,
      direction: "desc", // newest first
    });

    // Map to generic format
    const data = result.resources.map((res: CloudinaryResource) => ({
      _id: res.asset_id,
      public_id: res.public_id,
      url: res.url,
      secure_url: res.secure_url,
      format: res.format,
      resource_type: res.resource_type,
      width: res.width,
      height: res.height,
      createdAt: res.created_at,
      folder: res.folder || "",
    }));

    return NextResponse.json({
      success: true,
      count: data.length,
      data: data,
      next_cursor: result.next_cursor,
    });
  } catch (error) {
    console.error("Cloudinary listing error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to list uploads",
      },
      { status: 500 },
    );
  }
}

// POST /api/uploads - Upload new media
export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "hillz-shift";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine resource type
    const type = file.type.startsWith("video/") ? "video" : "image";

    // Upload to Cloudinary using stream
    const uploadResult: CloudinaryResource = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: folder,
              resource_type: type,
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result)
                return reject(new Error("Cloudinary upload failed: no result"));
              resolve(result as unknown as CloudinaryResource);
            },
          )
          .end(buffer);
      },
    );

    const responseData = {
      _id: uploadResult.asset_id,
      public_id: uploadResult.public_id,
      url: uploadResult.url,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      folder: folder, // Cloudinary result usually has folder info or we can assume it based on input
      resource_type: uploadResult.resource_type,
      width: uploadResult.width,
      height: uploadResult.height,
      createdAt: uploadResult.created_at,
    };

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/uploads - Delete media (using query param id for simplicity in single route file, or dynamic route)
// Generic API desc says DELETE /api/uploads/:id, so I should probably create [id]/route.ts
// But wait, user said "CRUD ENDPOINTS", so I will make [id]/route.ts separately.
