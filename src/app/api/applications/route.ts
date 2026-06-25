import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.jobId || !body.email) {
      return NextResponse.json(
        {
          title: "Validation Error",
          detail: "Missing jobId or email",
          status: 400,
        },
        { status: 400 }
      );
    }

    // Artificial 800ms delay
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    return NextResponse.json(
      {
        id: crypto.randomUUID(),
        jobId: body.jobId,
        email: body.email,
        submittedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        title: "Bad Request",
        detail: "Invalid JSON body",
        status: 400,
      },
      { status: 400 }
    );
  }
}
