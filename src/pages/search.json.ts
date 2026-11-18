import type { APIRoute } from 'astro';
import { formatDate, getWriteups, writeupUrl } from '../lib/writeups';

/** How much of each write-up's text is searchable. */
const MAX_TEXT_LENGTH = 20_000;

// The list the search pop-up downloads: every published write-up, newest first.
export const GET: APIRoute = async () => {
  const writeups = await getWriteups();
  const items = writeups.map((entry) => ({
    title: entry.data.title,
    url: writeupUrl(entry),
    date: entry.data.date.toISOString(),
    dateText: formatDate(entry.data.date),
    type: entry.data.type,
    source: entry.data.source,
    category: entry.data.category,
    tags: entry.data.tags,
    description: entry.data.description ?? '',
    text: (entry.body ?? '').toLowerCase().replace(/\s+/g, ' ').slice(0, MAX_TEXT_LENGTH),
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
