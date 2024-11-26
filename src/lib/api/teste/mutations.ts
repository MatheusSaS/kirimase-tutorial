import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  TesteId,
  NewTesteParams,
  UpdateTesteParams,
  updateTesteSchema,
  insertTesteSchema,
  teste,
  testeIdSchema,
} from "@/lib/db/schema/teste";
import { getUserAuth } from "@/lib/auth/utils";

export const createTeste = async (teste: NewTesteParams) => {
  const { session } = await getUserAuth();
  const newTeste = insertTesteSchema.parse({
    ...teste,
    userId: session?.user.id,
  });
  console.log(newTeste);

  try {
    const [t] = await db.insert(teste).values(newTeste).returning();
    return { teste: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTeste = async (id: TesteId, teste: UpdateTesteParams) => {
  const { session } = await getUserAuth();
  const { id: testeId } = testeIdSchema.parse({ id });
  const newTeste = updateTesteSchema.parse({
    ...teste,
    userId: session?.user.id!,
  });
  try {
    const [t] = await db
      .update(teste)
      .set({ ...newTeste, updatedAt: new Date() })
      .where(and(eq(teste.id, testeId!), eq(teste.userId, session?.user.id!)))
      .returning();
    return { teste: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTeste = async (id: TesteId) => {
  const { session } = await getUserAuth();
  const { id: testeId } = testeIdSchema.parse({ id });
  try {
    const [t] = await db
      .delete(teste)
      .where(and(eq(teste.id, testeId!), eq(teste.userId, session?.user.id!)))
      .returning();
    return { teste: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
