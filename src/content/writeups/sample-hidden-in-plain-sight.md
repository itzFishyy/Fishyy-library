---
title: Hidden in Plain Sight
ctf: Practice Wargame
category: forensics
tags: [Strings, Base64]
date: 2026-10-20
description: A sample write-up. The flag sits inside an image file as readable text.
---

> This is a **sample write-up** about a made-up challenge. Delete it once you have real write-ups.

## Challenge

We are given `cat.png` and told "there is more to this cat than meets the eye".

## Solution

Start with the cheapest check: look for readable text inside the file.

```bash
strings cat.png | tail -n 3
# IEND
# U0FNUExFe3N0cjFuZ3NfZjFyc3R9
```

Something was appended after the end of the image data, and it looks like Base64:

```bash
echo 'U0FNUExFe3N0cjFuZ3NfZjFyc3R9' | base64 -d
# SAMPLE{str1ngs_f1rst}
```

## What I learned

Run the simple tools first: `file`, `strings` and `exiftool` take seconds and solve a surprising number of easy forensics challenges.
