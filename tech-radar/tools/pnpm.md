# pnpm

**Category:** runtime (package manager)
**Ring:** adopt
**Used in:** MatricaRMZ (монорепо), GONBA (pnpm 10)
**First adopted:** ~2024 (MatricaRMZ монорепо)

## What
Альтернативный package manager для Node.js. Использует content-addressable store + симлинки → плоский диск, строгий dependency resolution. Нативная поддержка workspaces (монорепо).

## Why
- Экономит диск: один store на все проекты, симлинки в `node_modules`.
- Строже npm/yarn: пакет видит только свои объявленные зависимости (нет phantom deps).
- Лучший workspaces UX для монорепо (MatricaRMZ).
- Быстрее установка холодная и инкрементальная.

## Alternatives considered
- **npm** — все ещё в KARMAN; держим для не-монорепо где простота > выгод pnpm.
- **yarn (classic / berry)** — отвергнут: classic мёртв, berry PnP создал больше проблем чем решил.
- **bun** — на радаре (`assess`), но не пробовали как PM для прод-проектов.

## Notes
_(заполняется по мере накопления опыта — pitfalls, релизы, ADRs)_

## References
- https://pnpm.io/
