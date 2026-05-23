# Next.js 15

**Category:** frameworks (web)
**Ring:** adopt
**Used in:** GONBA
**First adopted:** ~2025 (GONBA, App Router + React Server Components)

## What
React-фреймворк с file-based routing, SSR/SSG/ISR, App Router (RSC), встроенные API routes, image/font optimization. С 15.x: stable Turbopack dev, React 19, async request APIs (`cookies()`, `headers()` теперь async).

## Why
- Прод-grade SSR + статика «из коробки».
- App Router + RSC: серверная логика рядом с UI, меньше JS на клиенте.
- Богатая экосистема, нативная интеграция с Vercel / self-host.
- Хорошо работает с Payload CMS (тот же runtime).

## Alternatives considered
- **Remix** — отличный конкурент, но экосистема Next.js шире, App Router + RSC покрывают use case.
- **Astro** — для контентных сайтов хорош, но GONBA нужен полноценный SSR/динамика.
- **SvelteKit / Nuxt** — другие language stacks, не наш React-фокус.

## Notes
- Breaking changes 14 → 15: `cookies()` / `headers()` стали async — болезненная миграция шаблонного кода.
- Turbopack dev стабилен с 15, но build всё ещё webpack.

## References
- https://nextjs.org/blog/next-15
