import type { Context } from "./ctx.ts";

// Wrap a test body in a transaction that always rolls back.
// Usage: test("name", test_withTx(() => ctx, async (txCtx) => { ... }))
export function test_withTx(getCtx: () => Context, fn: (ctx: Context) => Promise<void>) {
  return async () => {
    const reserved = await getCtx().db.reserve();
    await reserved`BEGIN`;
    const txCtx: Context = { db: reserved as any };
    try {
      await fn(txCtx);
    } finally {
      await reserved`ROLLBACK`;
      reserved.release();
    }
  };
}
