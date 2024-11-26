import { sql } from "drizzle-orm";
import { varchar, timestamp, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getSergioRouter } from "@/lib/api/sergioRouter/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const sergioRouter = pgTable('sergio_router', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

}, (sergioRouter) => {
  return {
    nameIndex: uniqueIndex('sergio_router_name_idx').on(sergioRouter.name),
  }
});


// Schema for sergioRouter - used to validate API requests
const baseSchema = createSelectSchema(sergioRouter).omit(timestamps)

export const insertSergioRouterSchema = createInsertSchema(sergioRouter).omit(timestamps);
export const insertSergioRouterParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateSergioRouterSchema = baseSchema;
export const updateSergioRouterParams = baseSchema.extend({}).omit({ 
  userId: true
});
export const sergioRouterIdSchema = baseSchema.pick({ id: true });

// Types for sergioRouter - used to type API request params and within Components
export type SergioRouter = typeof sergioRouter.$inferSelect;
export type NewSergioRouter = z.infer<typeof insertSergioRouterSchema>;
export type NewSergioRouterParams = z.infer<typeof insertSergioRouterParams>;
export type UpdateSergioRouterParams = z.infer<typeof updateSergioRouterParams>;
export type SergioRouterId = z.infer<typeof sergioRouterIdSchema>["id"];
    
// this type infers the return from getSergioRouter() - meaning it will include any joins
export type CompleteSergioRouter = Awaited<ReturnType<typeof getSergioRouter>>["sergioRouter"][number];

