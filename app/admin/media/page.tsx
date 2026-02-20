'use client';

import { MediaLibrary } from "@/src/components/admin/MediaLibrary";

export default function MediaPage() {
    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden">
            <MediaLibrary />
        </div>
    );
}
