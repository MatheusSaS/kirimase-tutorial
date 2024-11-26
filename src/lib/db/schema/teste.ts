import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getTestes } from "@/lib/api/teste/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const teste = pgTable("teste", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for teste - used to validate API requests
const baseSchema = createSelectSchema(teste).omit(timestamps);

export const insertTesteSchema = createInsertSchema(teste).omit(timestamps);
export const insertTesteParams = baseSchema.extend({}).omit({
  id: true,
  userId: true,
});

export const updateTesteSchema = baseSchema;
export const updateTesteParams = baseSchema.extend({}).omit({
  userId: true,
});
export const testeIdSchema = baseSchema.pick({ id: true });

// Types for teste - used to type API request params and within Components
export type Teste = typeof teste.$inferSelect;
export type NewTeste = z.infer<typeof insertTesteSchema>;
export type NewTesteParams = z.infer<typeof insertTesteParams>;
export type UpdateTesteParams = z.infer<typeof updateTesteParams>;
export type TesteId = z.infer<typeof testeIdSchema>["id"];

// this type infers the return from getTeste() - meaning it will include any joins
export type CompleteTeste = Awaited<
  ReturnType<typeof getTestes>
>["teste"][number];
