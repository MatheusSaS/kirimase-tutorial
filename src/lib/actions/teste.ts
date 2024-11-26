"use server";

import { revalidatePath } from "next/cache";
import {
  createTeste,
  deleteTeste,
  updateTeste,
} from "@/lib/api/teste/mutations";
import {
  TesteId,
  NewTesteParams,
  UpdateTesteParams,
  testeIdSchema,
  insertTesteParams,
  updateTesteParams,
} from "@/lib/db/schema/teste";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateTestes = () => revalidatePath("/teste");

export const createTesteAction = async (input: NewTesteParams) => {
  try {
    console.log(input);

    const payload = insertTesteParams.parse(input);
    console.log(payload);

    await createTeste(payload);
    revalidateTestes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTesteAction = async (input: UpdateTesteParams) => {
  try {
    const payload = updateTesteParams.parse(input);
    await updateTeste(payload.id, payload);
    revalidateTestes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTesteAction = async (input: TesteId) => {
  try {
    const payload = testeIdSchema.parse({ id: input });
    await deleteTeste(payload.id);
    revalidateTestes();
  } catch (e) {
    return handleErrors(e);
  }
};
