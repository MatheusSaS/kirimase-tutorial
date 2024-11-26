import { getTesteById, getTestes } from "@/lib/api/teste/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  testeIdSchema,
  insertTesteParams,
  updateTesteParams,
} from "@/lib/db/schema/teste";
import {
  createTeste,
  deleteTeste,
  updateTeste,
} from "@/lib/api/teste/mutations";

export const testeRouter = router({
  getTeste: publicProcedure.query(async () => {
    return getTestes();
  }),
  getTesteById: publicProcedure
    .input(testeIdSchema)
    .query(async ({ input }) => {
      return getTesteById(input.id);
    }),
  createTeste: publicProcedure
    .input(insertTesteParams)
    .mutation(async ({ input }) => {
      return createTeste(input);
    }),
  updateTeste: publicProcedure
    .input(updateTesteParams)
    .mutation(async ({ input }) => {
      return updateTeste(input.id, input);
    }),
  deleteTeste: publicProcedure
    .input(testeIdSchema)
    .mutation(async ({ input }) => {
      return deleteTeste(input.id);
    }),
});
