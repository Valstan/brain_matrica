# Drizzle ORM

**Category:** frameworks (db/orm)
**Ring:** adopt
**Used in:** MatricaRMZ
**First adopted:** ~2025 (MatricaRMZ, PostgreSQL)

## What
TypeScript ORM поверх node-postgres / better-sqlite. Query builder + schema-as-code, миграции через `drizzle-kit` в чистом SQL.

## Why
- Type-safe queries без runtime генерации client (как у Prisma).
- Schema = TS-объекты, легко рефакторить вместе с кодом.
- Миграции — обычный SQL, нет vendor-DSL.
- Лёгкий runtime, нет heavy bundle.

## Alternatives considered
- **Prisma** — отвергнут: тяжёлый generated client, миграции в собственном DSL, сложно с edge runtime.
- **TypeORM** — отвергнут: decorators + active record плохо стареют, типизация поверхностная.
- **Knex / raw pg** — отвергнут: нет типизации схемы, ручной маппинг result rows.

## Notes
_(заполняется по мере накопления опыта — pitfalls, релизы, ADRs)_

## References
- https://orm.drizzle.team/
