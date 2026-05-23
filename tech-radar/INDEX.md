# Tech Radar

Куратируемый список технологий с состоянием для нашего стека. Вдохновлено Thoughtworks Tech Radar, но проще.

## Кольца

- **adopt** — в эксплуатации, проверено, рекомендуется
- **trial** — внедрено в одном проекте, изучаем
- **assess** — на радаре, не пробовали, стоит исследовать
- **hold** — не использовать (либо deprecated, либо не подошло)

## Категории

- **languages** — языки программирования
- **runtime** — рантаймы, package managers
- **frameworks** — фреймворки (web, db, ui)
- **infra** — инфраструктура (deploy, monitoring, secrets)
- **tools** — инструменты разработки (linters, formatters, IDEs)
- **ai** — AI/LLM инструменты

## Таблица

| Tool | Category | Ring | Used in | Notes | File |
|---|---|---|---|---|---|
| **Drizzle ORM** | frameworks (db) | adopt | MatricaRMZ | TS ORM поверх node-postgres, миграции в SQL | [drizzle.md](tools/drizzle.md) |
| **Payload CMS** | frameworks (cms) | adopt | GONBA | Headless CMS, schema=код, self-hosted | [payload-cms.md](tools/payload-cms.md) |
| **Celery** | frameworks (task queue) | adopt | setka | Python task queue + Redis broker | [celery.md](tools/celery.md) |
| **pnpm** | runtime (pkg manager) | adopt | MatricaRMZ, GONBA | Симлинки + workspaces, строже npm | [pnpm.md](tools/pnpm.md) |
| **Next.js 15** | frameworks (web) | adopt | GONBA | App Router + RSC, async `cookies()/headers()` | [nextjs-15.md](tools/nextjs-15.md) |
| **Groq** | ai (inference) | assess | — | Быстрый LLM inference на LPU, не пробовали | [groq.md](tools/groq.md) |

## Формат файла

Один файл = одна технология (`tools/<slug>.md`). Компактный (~20 строк):

```markdown
# <Tool name>

**Category:** <category>
**Ring:** adopt | trial | assess | hold
**Used in:** <projects or —>
**First adopted:** <approx date or note>

## What
1-2 строки описание.

## Why
Что даёт, почему выбрали.

## Alternatives considered
Что рассматривали, почему не выбрали.

## Notes
Pitfalls / lessons по мере накопления.

## References
Официальная дока, релевантные ADRs.
```

## Workflow

1. **Заметка о технологии** → сразу в `tools/<name>.md` с минимальным описанием и категорией/кольцом.
2. **Обновление** — когда статус меняется (assess → trial → adopt или hold) пишем в файл новую дату с пометкой.
3. **Аудит** — раз в квартал в brain_matrica-сессии: пересматриваем `hold` (актуально ли отказались) и `assess` (исследовали ли).

## Что НЕ записывать

- Каждую новую библиотеку — только значимые для архитектурного выбора
- Технологии, которые мы не рассматриваем (это просто весь мир программирования)
- Альтернативы которые «теоретически интересны» без причины их рассмотреть
