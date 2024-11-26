/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type TesteId, testeIdSchema, teste } from "@/lib/db/schema/teste";

export const getTestes = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(teste)
    .where(eq(teste.userId, session?.user.id!));
  const t = rows;
  return { teste: t };
};

export const getTesteById = async (id: TesteId) => {
  const { session } = await getUserAuth();
  const { id: testeId } = testeIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(teste)
    .where(and(eq(teste.id, testeId), eq(teste.userId, session?.user.id!)));
  if (row === undefined) return {};
  const t = row;
  return { teste: t };
};
