---
title: Baby RSA
ctf: Sample CTF 2026
category: crypto
tags: [RSA, Small Exponent]
date: 2026-11-02
difficulty: Easy
description: A sample write-up. With e = 3 and a short message, the ciphertext is just a cube.
---

> This is a **sample write-up** about a made-up challenge. Delete it once you have real write-ups.

## Challenge

We get a public key and a ciphertext:

```text
n = (a 2048-bit number)
e = 3
c = (a much smaller number)
```

## Idea

RSA encrypts with `c = m^e mod n`. Here `e` is 3 and the message is short, so `m^3` is smaller than `n`. The `mod n` never happens, which means `c` is exactly `m^3`.

So the message is the ordinary cube root of `c`.

## Solution

```python
from gmpy2 import iroot

c = 0x1337  # the ciphertext from the challenge
m, exact = iroot(c, 3)
assert exact

print(bytes.fromhex(f"{m:x}"))
```

Output: `SAMPLE{sm4ll_e_sm4ll_m}`.

## What I learned

Small exponents are only safe together with proper padding (OAEP). Textbook RSA with `e = 3` and a short message has no security at all.
