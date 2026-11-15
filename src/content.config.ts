import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Tags may be written as a YAML list or as one comma-separated line
// (HackMD uses the second form), so both are accepted.
const tagList = z
  .preprocess(
    (value) => (typeof value === 'string' ? value.split(',') : (value ?? [])),
    z.array(z.coerce.string()),
  )
  .transform((tags) => [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))]);

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    /** Challenge name. */
    title: z.string(),
    /** The CTF event it came from, e.g. "CSCTF 2026". */
    ctf: z.string(),
    /** web, pwn, crypto, reverse, forensics, misc, ... */
    category: z
      .string()
      .default('misc')
      .transform((category) => category.trim().toLowerCase()),
    tags: tagList,
    /** When the write-up was written, e.g. 2026-11-08. */
    date: z.coerce.date(),
    /** Free text, e.g. "Easy" or "500 pts". */
    difficulty: z.coerce.string().optional(),
    /** One-line summary shown in lists. */
    description: z.string().optional(),
    /** Drafts show up while previewing on your computer but are left out of the published site. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { writeups };
