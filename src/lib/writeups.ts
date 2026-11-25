import { getCollection, type CollectionEntry } from 'astro:content';

export type Writeup = CollectionEntry<'writeups'>;

export interface Group {
  slug: string;
  label: string;
  entries: Writeup[];
}

/** One folder on the way to a write-up, e.g. "CSCTF 2026" inside "Competitions". */
export interface FolderRef {
  /** The folder name exactly as it is written in the repo. */
  name: string;
  /** Its place in the folder list, for URLs: "competitions/csctf-2026". */
  path: string;
}

/** A folder with everything inside it. */
export interface FolderNode extends FolderRef {
  folders: FolderNode[];
  /** Write-ups saved directly in this folder, newest first. */
  entries: Writeup[];
  /** Write-ups in this folder and all folders inside it. */
  count: number;
  /** Date of the newest write-up inside, used to order folders. */
  newest: number;
}

/** Where write-up files live, relative to the project folder. */
const CONTENT_DIR = 'src/content/writeups/';

const newestFirst = (a: Writeup, b: Writeup) =>
  b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title);

/**
 * Every write-up file. The file name is the write-up's address, so two files
 * with the same name in different folders would fight over one page: that is
 * reported here instead of one silently replacing the other.
 */
async function loadAll(): Promise<Writeup[]> {
  const all = await getCollection('writeups');
  const seen = new Map<string, Writeup>();
  for (const entry of all) {
    const slug = writeupSlug(entry);
    const other = seen.get(slug);
    if (other) {
      throw new Error(
        `Two write-ups have the same file name "${slug}":\n` +
          `  ${other.filePath}\n  ${entry.filePath}\n` +
          `The file name is the write-up's address, so rename one of them.`,
      );
    }
    seen.set(slug, entry);
  }
  return all;
}

/** All published write-ups, newest first. */
export async function getWriteups(): Promise<Writeup[]> {
  const all = await loadAll();
  return all.filter((entry) => (import.meta.env.PROD ? !entry.data.draft : true)).sort(newestFirst);
}

/**
 * Drafts on the published site. They are left out of every list, but each
 * still gets a page saying it is not available. Cloudflare keeps serving a
 * removed page from its saved copy for days, while a changed page updates
 * at once, so replacing the page is what takes a write-up down right away.
 * In the preview on your computer drafts are shown in full, so this is empty.
 */
export async function getHiddenDrafts(): Promise<Writeup[]> {
  if (!import.meta.env.PROD) return [];
  return (await loadAll()).filter((entry) => entry.data.draft);
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

/** The last part of a write-up's address, taken from its file name only. */
export const writeupSlug = (entry: Writeup) => entry.id.split('/').pop() ?? entry.id;

/**
 * The folders a write-up is saved in, outermost first. A file at
 * `Competitions/CSCTF 2026/cookie-jar.md` gives "Competitions", then "CSCTF 2026".
 */
export function foldersOf(entry: Writeup): FolderRef[] {
  const file = (entry.filePath ?? '').replaceAll('\\', '/');
  const start = file.indexOf(CONTENT_DIR);
  if (start === -1) return [];
  const names = file
    .slice(start + CONTENT_DIR.length)
    .split('/')
    .slice(0, -1);
  const slugs: string[] = [];
  return names.map((name) => {
    slugs.push(slugify(name));
    return { name, path: slugs.join('/') };
  });
}

/**
 * The event or platform a write-up belongs to: its folders below the top
 * level ("OverTheWire / Bandit"), or the top-level folder if that is all it has.
 */
export function sourceOf(entry: Writeup): { label: string; path: string } | null {
  const folders = foldersOf(entry);
  if (folders.length === 0) return null;
  const shown = folders.length > 1 ? folders.slice(1) : folders;
  return { label: shown.map((folder) => folder.name).join(' / '), path: folders.at(-1)!.path };
}

export const writeupUrl = (entry: Writeup) => `/writeups/${writeupSlug(entry)}/`;
export const folderUrl = (path: string) => `/folders/${path}/`;
/** Category and tag links open the homepage with that filter switched on. */
export const categoryUrl = (category: string) => `/?category=${slugify(category)}#writeups`;
export const tagUrl = (tag: string) => `/?tag=${slugify(tag)}#writeups`;

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
 * Groups write-ups by one or more labels (a category, or tags).
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

export const groupByCategory = (writeups: Writeup[]) => groupBy(writeups, (e) => [e.data.category]);
export const groupByTag = (writeups: Writeup[]) => groupBy(writeups, (e) => e.data.tags);

/** How many different events and platforms the write-ups come from. */
export function countSources(writeups: Writeup[]): number {
  const paths = writeups.map((entry) => foldersOf(entry).slice(0, 2).at(-1)?.path);
  return new Set(paths.filter(Boolean)).size;
}

/**
 * The folder list: every folder with its sub-folders and write-ups.
 * The returned folder is the top of the list itself (it has no name); its
 * `entries` are write-ups saved outside any folder.
 *
 * Top-level folders are in alphabetical order so the main shelves stay put.
 * Folders inside them are ordered by their newest write-up, newest first.
 */
export function buildTree(writeups: Writeup[]): FolderNode {
  const root: FolderNode = { name: '', path: '', folders: [], entries: [], count: 0, newest: 0 };
  for (const entry of [...writeups].sort(newestFirst)) {
    const date = entry.data.date.valueOf();
    let node = root;
    node.count += 1;
    node.newest = Math.max(node.newest, date);
    for (const folder of foldersOf(entry)) {
      let next = node.folders.find((child) => child.path === folder.path);
      if (!next) {
        next = { ...folder, folders: [], entries: [], count: 0, newest: 0 };
        node.folders.push(next);
      }
      node = next;
      node.count += 1;
      node.newest = Math.max(node.newest, date);
    }
    node.entries.push(entry);
  }

  const order = (node: FolderNode, top: boolean) => {
    node.folders.sort((a, b) =>
      top ? a.name.localeCompare(b.name) : b.newest - a.newest || a.name.localeCompare(b.name),
    );
    for (const child of node.folders) order(child, false);
  };
  order(root, true);
  return root;
}

/** Every folder in the list, at any depth. */
export function allFolders(node: FolderNode): FolderNode[] {
  return node.folders.flatMap((child) => [child, ...allFolders(child)]);
}

/** All write-ups in a folder and the folders inside it, newest first. */
export function entriesIn(node: FolderNode): Writeup[] {
  return [...node.entries, ...node.folders.flatMap(entriesIn)].sort(newestFirst);
}

/** Up to `limit` other write-ups that share tags, folder or category with this one. */
export function getRelated(entry: Writeup, writeups: Writeup[], limit = 3): Writeup[] {
  const tags = new Set(entry.data.tags.map(slugify));
  const folder = foldersOf(entry).at(-1)?.path;
  return writeups
    .filter((other) => other.id !== entry.id)
    .map((other) => {
      const sharedTags = other.data.tags.filter((tag) => tags.has(slugify(tag))).length;
      const sameFolder = folder && foldersOf(other).at(-1)?.path === folder ? 1 : 0;
      const sameCategory = other.data.category === entry.data.category ? 1 : 0;
      return { other, score: sharedTags * 3 + sameFolder * 2 + sameCategory };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
}
