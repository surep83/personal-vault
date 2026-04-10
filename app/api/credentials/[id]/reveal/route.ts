import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  credentialIdParamSchema,
  revealCredentialSchema,
} from "@/lib/validators/credential";
import {
  NotFoundError,
  credentialService,
} from "@/services/credential.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const params = credentialIdParamSchema.parse(await context.params);
    const body = await request.json().catch(() => ({}));
    revealCredentialSchema.parse(body);

    const revealed = await credentialService.revealPassword(params.id);
    return NextResponse.json({ data: revealed }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to reveal password" },
      { status: 500 },
    );
  }
}
