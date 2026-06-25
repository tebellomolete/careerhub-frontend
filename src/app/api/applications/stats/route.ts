import { NextResponse } from "next/server";

const MOCK_STATS = [
  { jobId: "a1b2c3d4-e5f6-7890-1234-56789abcdef0", applicationCount: 14 },
  { jobId: "b2c3d4e5-f6a7-8901-2345-6789abcdef01", applicationCount: 0 },
  { jobId: "c3d4e5f6-a7b8-9012-3456-789abcdef012", applicationCount: 89 },
  { jobId: "d4e5f6a7-b8c9-0123-4567-89abcdef0123", applicationCount: 5 },
  { jobId: "e5f6a7b8-c9d0-1234-5678-9abcdef01234", applicationCount: 42 },
  { jobId: "f6a7b8c9-d0e1-2345-6789-abcdef012345", applicationCount: 3 }
];

export async function GET() {
  return NextResponse.json(MOCK_STATS);
}

export async function POST() {
  return NextResponse.json(
    { title: "Method Not Allowed", detail: "Use GET", status: 405 },
    { status: 405 }
  );
}
