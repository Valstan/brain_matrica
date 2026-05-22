# Projects Registry

Реестр всех проектов под управлением. Обновлять при значимых событиях (новый прод-URL, смена стека, заморозка/возобновление).

| Проект | Стек | Прод | Статус | Файл |
|---|---|---|---|---|
| **MatricaRMZ** | Electron + Node + PostgreSQL + Drizzle, монорепо pnpm | https://195.161.41.30/ v1.21.1 | active | [MatricaRMZ.md](MatricaRMZ.md) |
| **GONBA** | Next.js 15 + Payload CMS + PostgreSQL, pnpm 10 | https://гоньба.рф/ (rolling, без релизов) | active (Media→Я.Диск миграция) | [GONBA.md](GONBA.md) |
| **setka** | Python 3.12 + Celery + Redis, VK API | внутренний (нет public URL?) | active | [setka.md](setka.md) |

## Как заполнять файл проекта

Шаблон в [_template.md](_template.md). Минимум для каждого проекта:

- **Repo URL** — GitHub
- **Local clone** — стандартный путь на компе
- **Стек** — основные технологии (язык, фреймворк, БД, deploy)
- **Прод** — URL, версия, deploy метод
- **Owner / SSH alias** — кто работает, какой SSH host алиас
- **Текущая фаза** — что разрабатывается сейчас (если знаем)
- **Связанные идеи** — ссылки на pool (e.g. идея №001 применена)
- **Связанные ADRs** — ссылки на cross-project ADRs которые касаются этого проекта
