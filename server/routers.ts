import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getLoginAttempts, insertLoginAttempt } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  loginAttempts: router({
    // Public endpoint — called from PinLock before auth is established
    log: publicProcedure
      .input(
        z.object({
          success: z.boolean(),
          attemptNumber: z.number().int().min(1).max(10).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ip =
          (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          ctx.req.socket?.remoteAddress ||
          null;
        const userAgent = (ctx.req.headers["user-agent"] as string) || null;
        await insertLoginAttempt({
          success: input.success ? 1 : 0,
          ip,
          userAgent,
          attemptNumber: input.attemptNumber ?? 1,
        });
        return { ok: true };
      }),

    // Admin-only — returns full log
    list: publicProcedure.query(async () => {
      return getLoginAttempts(500);
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
