import { publicProcedure, router } from "../index";
import { rankingRouter } from "./ranking";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  ranking: rankingRouter,
});
export type AppRouter = typeof appRouter;
