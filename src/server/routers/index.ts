// server/routers/_app.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name ?? 'world'}!` };
    }),
  // tambahkan procedure lainnya di sini
});

export type AppRouter = typeof appRouter;