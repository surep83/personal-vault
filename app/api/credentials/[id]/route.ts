import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  credentialIdParamSchema,
  updateCredentialSchema,
} from "@/lib/validators/credential";
import {
  NotFoundError,
  credentialService,
} from "@/services/credential.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = credentialIdParamSchema.parse(await context.params);
    const credential = await credentialService.getCredentialById(params.id);

    return NextResponse.json({ data: credential }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid credential id", details: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to fetch credential" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const params = credentialIdParamSchema.parse(await context.params);
    const body = await request.json();
    const payload = updateCredentialSchema.parse(body);
    const updated = await credentialService.updateCredential(params.id, payload);

    return NextResponse.json({ data: updated }, { status: 200 });
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
      { error: "Failed to update credential" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const params = credentialIdParamSchema.parse(await context.params);
    const deleted = await credentialService.deleteCredential(params.id);

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid credential id", details: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete credential" },
      { status: 500 },
    );
  }
}
