import { getCollection, type CollectionEntry } from 'astro:content';

export type Writeup = CollectionEntry<'writeups'>;

export interface Group {
  slug: string;
  label: string;
  entries: Writeup[];
}

/** All published write-ups, newest first. */
export async function getWriteups(): Promise<Writeup[]> {
  const all = await getCollection('writeups', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return all.sort(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  );
}

/** Turns "CSCTF 2026" into "csctf-2026" for use in URLs. */
export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'untitled';
}

export const writeupUrl = (entry: Writeup) => `/writeups/${entry.id}/`;
export const ctfUrl = (ctf: string) => `/ctf/${slugify(ctf)}/`;
export const categoryUrl = (category: string) => `/category/${slugify(category)}/`;
export const tagUrl = (tag: string) => `/tags/${slugify(tag)}/`;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function readingTime(entry: Writeup): string {
  const words = (entry.body ?? '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/**
 * Groups write-ups by one or more labels each (a CTF name, a category, tags).
 * Groups keep the order in which they are first seen, so with newest-first
 * input the group holding the newest write-up comes first.
 */
export function groupBy(writeups: Writeup[], labelsOf: (entry: Writeup) => string[]): Group[] {
  const groups = new Map<string, Group>();
  for (const entry of writeups) {
    for (const label of labelsOf(entry)) {
      const slug = slugify(label);
      const group = groups.get(slug) ?? { slug, label, entries: [] };
      group.entries.push(entry);
      groups.set(slug, group);
    }
  }
  return [...groups.values()];
}

export const groupByCtf = (writeups: Writeup[]) => groupBy(writeups, (e) => [e.data.ctf]);
export const groupByCategory = (writeups: Writeup[]) => groupBy(writeups, (e) => [e.data.category]);
export const groupByTag = (writeups: Writeup[]) => groupBy(writeups, (e) => e.data.tags);

/** Up to `limit` other write-ups that share tags, CTF or category with this one. */
export function getRelated(entry: Writeup, writeups: Writeup[], limit = 3): Writeup[] {
  const tags = new Set(entry.data.tags.map(slugify));
  return writeups
    .filter((other) => other.id !== entry.id)
    .map((other) => {
      const sharedTags = other.data.tags.filter((tag) => tags.has(slugify(tag))).length;
      const sameCtf = slugify(other.data.ctf) === slugify(entry.data.ctf) ? 1 : 0;
      const sameCategory = other.data.category === entry.data.category ? 1 : 0;
      return { other, score: sharedTags * 3 + sameCtf * 2 + sameCategory };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
}
