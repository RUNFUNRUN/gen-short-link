import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url(),
});

export const linkSchema = z.object({
  key: z.string(),
  originalUrl: z.string().url(),
});

export const linksSchema = z.array(
  z.object({
    key: z.string(),
    originalUrl: z.string().url(),
  }),
);
