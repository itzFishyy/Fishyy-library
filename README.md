# Fishyy's Library

A blog for CTF write-ups, built with [Astro](https://astro.build).

## Preview the site on your computer

Open a terminal in this folder and run:

```
npm run dev
```

Then open http://localhost:4321 in your browser. The page refreshes by itself when you change a file. Press `Ctrl+C` in the terminal to stop.

## Add a write-up

Put a Markdown file in `src/content/writeups/`. The file name becomes the address, so `my-challenge.md` appears at `/writeups/my-challenge/`.

Every write-up starts with this header:

```yaml
---
title: Challenge name
ctf: Name of the CTF
category: web
tags: [JWT, Auth Bypass]
date: 2026-11-08
difficulty: Easy
description: One line shown in lists.
---
```

- `title`, `ctf` and `date` are required.
- `category` defaults to `misc`.
- `tags`, `difficulty` and `description` are optional. Tags can also be written on one line, separated by commas: `tags: JWT, Auth Bypass`.
- Add `draft: true` to keep a write-up out of the published site while you work on it.

Headings that start with `##` and `###` become the table of contents.

## Change things

| What | Where |
| --- | --- |
| Your name, homepage introduction, terminal card, About text and links | `src/site.config.ts` |
| Navigation bar | `src/site.config.ts` |
| Friends list on the About page | `src/data/friends.ts` |
| Colors and fonts | `src/styles/theme.css` |
| Layout and styling of everything else | `src/styles/global.css` |

## Build the published version

```
npm run build
```

The finished site is written to the `dist` folder.
