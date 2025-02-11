import { createKey } from '@/lib/kv';
import { urlSchema } from '@/lib/schema';
import { zValidator } from '@hono/zod-validator';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { handle } from 'hono/vercel';

const app = new Hono()
  .basePath('/api')
  .use(csrf())
  .post('/', zValidator('json', urlSchema), async (c) => {
    const { url } = c.req.valid('json');
    try {
      const { env } = getCloudflareContext();
      const kv = env.LINK_KV;
      const key = await createKey(kv, url);
      return c.json({ key }, 201);
    } catch {
      return c.json({}, 500);
    }
  });

export type AppType = typeof app;

export const POST = handle(app);
