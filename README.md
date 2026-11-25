# Fishyy's Library

A blog for CTF write-ups, built with [Astro](https://astro.build).

## Preview the site on your computer

Open a terminal in this folder and run:

```
npm run dev
```

Then open http://localhost:4321 in your browser. The page refreshes by itself when you change a file. Press `Ctrl+C` in the terminal to stop.

## Add a write-up

Put a Markdown file in a folder inside `src/content/writeups/`. The folders are what the Writeups page shows on its left side, so where you save the file decides where it appears:

```
src/content/writeups/
  Competitions/
    CSCTF 2026/
      cookie-jar.md
  Learning & Practice/
    OverTheWire/
      Bandit/
        bandit-level-5.md
```

- Folder names are shown exactly as you write them, spaces and capitals included.
- Folders can be as deep as you like. To reorganise, move the file.
- Top-level folders are listed in alphabetical order. Folders inside them are ordered by their newest write-up.
- The file name alone becomes the address: `cookie-jar.md` appears at `/writeups/cookie-jar/` whichever folder it is in. Moving a file does not change its link, but two files cannot share a name.

Every write-up starts with this header:

```yaml
---
title: Challenge name
category: linux
tags: [SSH, Linux]
date: 2026-11-08
difficulty: Easy
description: One line shown in lists.
---
```

- `title` and `date` are required.
- `category` defaults to `misc`.
- `tags`, `difficulty` and `description` are optional. Tags can also be written on one line, separated by commas: `tags: JWT, Auth Bypass`.
- Add `draft: true` to keep a write-up out of the published site while you work on it.

Headings that start with `##` and `###` become the table of contents.

### Sample write-ups

Any write-up whose file name starts with `sample-` stays on this computer: it shows in the preview but is never sent to GitHub (see `.gitignore`). Handy for trying something out without publishing it.

## Where things are on the site

| Page | Shows |
| --- | --- |
| Home | The latest write-up, then all of them, with category and tag buttons that narrow the list |
| Writeups | The folder list on the left and a write-up on the right |
| Archive | Every write-up by date, one line each |

## Change things

| What | Where |
| --- | --- |
| Your name, homepage introduction, terminal card, About text and links | `src/site.config.ts` |
| Navigation bar | `src/site.config.ts` |
| Welcome text on the Writeups page | `src/site.config.ts` (`writeupsPage`) |
| Friends list on the About page | `src/data/friends.ts` |
| Colors and fonts | `src/styles/theme.css` |
| Layout and styling of everything else | `src/styles/global.css` |

## Build the published version

```
npm run build
```

The finished site is written to the `dist` folder.
