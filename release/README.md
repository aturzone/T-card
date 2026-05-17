# proop.shop — offline deploy bundle

This directory contains the Docker image `proop-shop:latest` packaged as a
gzipped tar (31 MB) for offline transport. The target server does **not**
need internet access — only Docker.

## Files

- `proop-shop_latest.tar.gz` — `docker save` of `proop-shop:latest`,
  gzipped (level 9). Multi-arch manifest, nginx-alpine runtime, SPA fallback
  and 1-year cache headers on hashed assets.

## Load on the offline server

```bash
# 1. Copy the .tar.gz to the server (scp / usb stick / whatever)
# 2. On the server, restore the image:
gunzip -c proop-shop_latest.tar.gz | docker load
# Loaded image: proop-shop:latest

# 3. Run it. Maps container port 80 → host port 8080.
docker run -d --name proop-shop --restart unless-stopped \
  -p 8080:80 proop-shop:latest

# 4. Verify:
curl -I http://localhost:8080/
# HTTP/1.1 200 OK
```

The app then answers on `http://<server>:8080/`. SPA hash-router so every
deep link works (`/#/shop`, `/#/product/<id>`, etc.) — no nginx route
rewrites required.

## Stop / replace

```bash
docker stop proop-shop && docker rm proop-shop
# To update: re-copy a new .tar.gz, `docker load` it, then `docker run` again.
```

## Build details

| Bit | Value |
|---|---|
| Image size (uncompressed) | ≈ 80 MB (nginx-alpine + dist/) |
| Image size (gzipped tar) | 31 MB |
| Built from | `frontend/Dockerfile` (multi-stage Node 20 → nginx-alpine) |
| Bundle | 1.3 MB total, 358 KB gzipped over the wire |
| Hero asset | `models/bust_smooth_draco.glb` (3.7 MB, Draco-compressed) |
| Routes | hash-router `#/`, `#/shop`, `#/product/:id`, `#/cart`, `#/checkout`, `#/faq`, `#/about`, `#/contact`, `#/account` |

No env vars, no runtime config — drop-in.
