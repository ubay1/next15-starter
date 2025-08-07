// server/routers/_app.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { userRouter } from './user';

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return { message: `Hello, ${input.name ?? 'world'}!` };
    }),
  profil: publicProcedure
    .input(z.object({ name: z.string(), age: z.string(), role: z.string() }))
    .query(({ input }) => {
      return {
        message: `Name: ${input.name} \n Age: ${input.age} \n Role: ${input.role}`
      }
    }),
  // example with supabase
  user: userRouter
  // tambahkan procedure lainnya di sini
});

export type AppRouter = typeof appRouter;