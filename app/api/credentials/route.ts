import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createCredentialSchema } from "@/lib/validators/credential";
import { credentialService } from "@/services/credential.service";

export async function GET() {
  try {
    const credentials = await credentialService.listCredentials();
    return NextResponse.json({ data: credentials }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to list credentials" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createCredentialSchema.parse(body);
    const created = await credentialService.createCredential(payload);

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create credential" },
      { status: 500 },
    );
  }
}
