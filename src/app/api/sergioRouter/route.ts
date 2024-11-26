import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createSergioRouter,
  deleteSergioRouter,
  updateSergioRouter,
} from "@/lib/api/sergioRouter/mutations";
import { 
  sergioRouterIdSchema,
  insertSergioRouterParams,
  updateSergioRouterParams 
} from "@/lib/db/schema/sergioRouter";

export async function POST(req: Request) {
  try {
    const validatedData = insertSergioRouterParams.parse(await req.json());
    const { sergioRouter } = await createSergioRouter(validatedData);

    revalidatePath("/sergioRouter"); // optional - assumes you will have named route same as entity

    return NextResponse.json(sergioRouter, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateSergioRouterParams.parse(await req.json());
    const validatedParams = sergioRouterIdSchema.parse({ id });

    const { sergioRouter } = await updateSergioRouter(validatedParams.id, validatedData);

    return NextResponse.json(sergioRouter, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = sergioRouterIdSchema.parse({ id });
    const { sergioRouter } = await deleteSergioRouter(validatedParams.id);

    return NextResponse.json(sergioRouter, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
