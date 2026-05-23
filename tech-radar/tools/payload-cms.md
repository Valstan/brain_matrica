# Payload CMS

**Category:** frameworks (cms / headless)
**Ring:** adopt
**Used in:** GONBA
**First adopted:** ~2025 (GONBA, Next.js 15 + PostgreSQL)

## What
Headless CMS на Node.js / TypeScript. Admin UI, REST + GraphQL API, collections/globals/blocks как TS-конфиг. Self-hosted, не SaaS.

## Why
- Schema = код, легко версионируется.
- Встроенный admin UI без отдельного фронтенда.
- Хорошо интегрируется с Next.js (тот же runtime).
- Self-hosted — данные у нас, нет vendor lock-in.

## Alternatives considered
- **Strapi** — конкурент, но Payload TS-first, типизация сильнее.
- **Sanity / Contentful** — SaaS, vendor lock-in, дорого на масштабе.
- **Directus** — DB-first, для нашего use case (collections + кастомные блоки) слабее.

## Notes
_(заполняется по мере накопления опыта — pitfalls, релизы, ADRs)_

## References
- https://payloadcms.com/
