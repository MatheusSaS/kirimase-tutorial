import { router } from "@/lib/server/trpc";
import { testeRouter } from "./teste";

export const appRouter = router({
  teste: testeRouter,
});

export type AppRouter = typeof appRouter;
