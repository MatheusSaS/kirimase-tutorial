import { sql } from "drizzle-orm";
import {
  text,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nanoid, timestamps } from "@/lib/utils";
import { getRotaTrpcs } from "@/lib/api/rotaTrpc/queries";

export const rotaTrpc = pgTable(
  "rota_trpc",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
  },
  (rotaTrpc) => {
    return {
      nameIndex: uniqueIndex("rota_trpc_name_idx").on(rotaTrpc.name),
    };
  }
);

// Schema for rotaTrpc - used to validate API requests
const baseSchema = createSelectSchema(rotaTrpc).omit(timestamps);

export const insertRotaTrpcSchema =
  createInsertSchema(rotaTrpc).omit(timestamps);
export const insertRotaTrpcParams = baseSchema.extend({}).omit({
  id: true,
  userId: true,
});

export const updateRotaTrpcSchema = baseSchema;
export const updateRotaTrpcParams = baseSchema.extend({}).omit({
  userId: true,
});
export const rotaTrpcIdSchema = baseSchema.pick({ id: true });

// Types for rotaTrpc - used to type API request params and within Components
export type RotaTrpc = typeof rotaTrpc.$inferSelect;
export type NewRotaTrpc = z.infer<typeof insertRotaTrpcSchema>;
export type NewRotaTrpcParams = z.infer<typeof insertRotaTrpcParams>;
export type UpdateRotaTrpcParams = z.infer<typeof updateRotaTrpcParams>;
export type RotaTrpcId = z.infer<typeof rotaTrpcIdSchema>["id"];

// this type infers the return from getRotaTrpc() - meaning it will include any joins
export type CompleteRotaTrpc = Awaited<
  ReturnType<typeof getRotaTrpcs>
>["rotaTrpc"][number];
