# mailboxes/ — почтовая система brain ↔ projects

См. [ADR-0001](../adr/0001-brain-projects-mailboxes.md) и [POSTULATES](../docs/POSTULATES.md) §I.

## Структура

```
mailboxes/
  <PROJECT>/
    .last-seen                   # ISO timestamp последнего /start проекта
    from-brain/                  # brain → project
      DRAFTS/                    # черновики brain, ждут утверждения пользователя
      YYYY-MM-DD-slug.md         # отправленные, не прочитанные проектом
      ARCHIVE/                   # прочитанные + дописанная секция ## Result
    to-brain/                    # project → brain
      YYYY-MM-DD-slug.md         # присланные, brain ещё не обработал
      ARCHIVE/                   # обработанные brain'ом
```

## Жизненный цикл письма brain → project

1. brain в meta-сессии готовит draft в `<P>/from-brain/DRAFTS/YYYY-MM-DD-slug.md`
2. Пользователь смотрит summary, утверждает (или правит)
3. brain переносит draft в `<P>/from-brain/YYYY-MM-DD-slug.md`, коммит
4. Проектная сессия в `/start` видит письмо, обрабатывает
5. Проектная сессия двигает файл в `<P>/from-brain/ARCHIVE/YYYY-MM-DD-slug.md`, дописывает `## Result` в конец, коммит

## Жизненный цикл письма project → brain

1. Проектная сессия пишет файл в `<P>/to-brain/YYYY-MM-DD-slug.md`, коммит
2. Brain в meta-сессии в `/start` сканит все `to-brain/*.md`, докладывает
3. Brain обрабатывает (форвардит другим проектам, добавляет в pool идей, делает ADR, etc)
4. Brain двигает файл в `<P>/to-brain/ARCHIVE/`, дописывает `## Processed` (что сделали), коммит

## Frontmatter писем

```yaml
---
from: brain | <PROJECT>
to: <PROJECT> | brain
date: YYYY-MM-DD
topic: short subject line
kind: idea | directive | question | feedback | report
urgency: low | normal | high
links: [...]      # опционально
ref: [...]        # опционально, если ответ на другое письмо
---
```

`kind`:
- **idea** — рекомендация «попробуй»
- **directive** — обязательное «сделай X»
- **question** — ответь когда сможешь
- **feedback** — результат / что вышло
- **report** — статус, ответа не требует

`urgency: high` → проект обязательно поднимает письмо в начале /start, даже если оно одно.

## `.last-seen`

Один файл на проект, формат:
```
2026-05-22T14:30:00+03:00
```
Проект в каждом /start обновляет содержимое. brain в reflection видит «X не заходил Y дней» и поднимает в kill-policy.

## Что НЕ кладём в mailbox

- Tactical баги проекта (это в `<P>/docs/PENDING_FOLLOWUPS.md` самого проекта)
- Большие планы (это `docs/plans/` brain'а, в письме только ссылка)
- Personal-memory вещи (это `~/.claude/projects/<slug>/memory/`)
- Дубли pool-идей (письмо может ссылаться на pool, но не дублировать содержимое)
