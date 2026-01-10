import { NextResponse } from "next/server";
import { db } from "@/src/lib/firebaseAdmin";
import { AdminAuthError, requireAdminSession } from "@/src/lib/adminSession";

type DailyPoint = {
  date: string; // YYYY-MM-DD
  label: string; // e.g. Jan 10
  registrations: number;
  invitations: number;
};

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  // Firestore Timestamp (admin sdk) has toDate()
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: unknown }).toDate === "function") {
    try {
      const d = (value as { toDate: () => Date }).toDate();
      return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
    } catch {
      return null;
    }
  }
  return null;
}

function ymdUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const m = `${d.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${d.getUTCDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function labelFor(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET(request: Request) {
  try {
    await requireAdminSession();

    const url = new URL(request.url);
    const daysParam = Number(url.searchParams.get("days") || "14");
    const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 7), 60) : 14;

    // Build day buckets in UTC
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    start.setUTCDate(start.getUTCDate() - (days - 1));

    const buckets = new Map<string, DailyPoint>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const key = ymdUTC(d);
      buckets.set(key, {
        date: key,
        label: labelFor(d),
        registrations: 0,
        invitations: 0,
      });
    }

    // Query only recent docs. ISO strings are lexicographically sortable by time.
    const startIso = start.toISOString();

    const [regSnapshot, invSnapshot] = await Promise.all([
      db.collection("registrations").where("createdAt", ">=", startIso).get(),
      db.collection("invitations").where("createdAt", ">=", startIso).get(),
    ]);

    regSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const d = toDate(data?.createdAt);
      if (!d) return;
      const key = ymdUTC(d);
      const point = buckets.get(key);
      if (point) point.registrations += 1;
    });

    invSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const d = toDate(data?.createdAt);
      if (!d) return;
      const key = ymdUTC(d);
      const point = buckets.get(key);
      if (point) point.invitations += 1;
    });

    const series = Array.from(buckets.values());
    const totals = {
      registrations: series.reduce((sum, p) => sum + p.registrations, 0),
      invitations: series.reduce((sum, p) => sum + p.invitations, 0),
    };

    return NextResponse.json({
      success: true,
      rangeDays: days,
      startDate: startIso,
      series,
      totals,
    });
  } catch (error: unknown) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json(
        { success: false, error: error.code },
        { status: error.code === "FORBIDDEN" ? 403 : 401 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : "Failed to load analytics";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

