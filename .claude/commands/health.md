---
description: Быстрый health-дашборд brain_matrica + всех проектов (без полного /start, без коммитов)
---

Быстрый снимок состояния. Лёгкая альтернатива `/start` когда нужно просто посмотреть «всё ли в порядке» без полной meta-сессии. **Не пишет в git, не делает fetch, не подтягивает sibling-репо** — только локальное состояние.

Цель — 5-10 секунд + одна таблица.

## Что собрать

### brain_matrica локально

```bash
git branch --show-current
git status --short | head -5
git log --oneline -3
```

Зафиксируй:
- Ветка (`main` ожидается)
- Есть ли uncommitted (если да — что)
- Последние 3 коммита

### Открытые PR в brain_matrica

```bash
gh pr list --state open --limit 5
```

### Для каждого проекта (read-only локально, без `cd`)

Для каждого из MatricaRMZ / GONBA / setka / KARMAN:

```bash
git -C ../<proj> log -1 --format='%cI %h %s'
git -C ../<proj> branch --show-current
```

И прочитай:
- `../<proj>/docs/SESSION_HANDOFF.md` если есть — Status (ACTIVE/IDLE) + Updated date
- Сравни последний коммит в `../<proj>/mailbox/to-brain/` с `mailboxes/<proj>/.last-seen`:

```bash
remote=$(git -C ../<proj> log -1 --format=%cI -- mailbox/to-brain/ 2>/dev/null)
seen=$(cat mailboxes/<proj>/.last-seen 2>/dev/null)
# если remote > seen → 📬 NEW mail flag
```

### Письма от brain ждут ответа

Список непустых файлов (не ARCHIVE/DRAFTS) в каждом `mailboxes/<proj>/from-brain/`:

```bash
ls mailboxes/*/from-brain/*.md 2>/dev/null | grep -v ARCHIVE | grep -v DRAFTS
```

## Формат отчёта (таблица + футер)

```markdown
## 🩺 brain_matrica health — YYYY-MM-DD HH:MM

**brain_matrica:** branch=main, clean | uncommitted (M files)
**Open PRs in brain:** N
**Inbox:** пуст | N items

| Project | Last commit | Phase | Session | 📬 to-brain | 📤 awaiting reply |
|---|---|---|---|---|---|
| MatricaRMZ | <date> <hash> | deep flow | ACTIVE 2d ago | — / 1 new | 2 |
| GONBA | <date> <hash> | between threads | IDLE | — | 1 |
| setka | <date> <hash> | deep flow | — | — | — |
| KARMAN | <date> <hash> | between threads | — | — | — |

**Затыки:**
- <если что-то требует внимания — 1-3 пункта>
- если всё штатно — «🟢 штатно»
```

## Что НЕ делает

- ❌ Не делает `git fetch` (быстрее, и не нужно для local snapshot)
- ❌ Не делает `git pull` нигде
- ❌ Не пишет файлы
- ❌ Не сохраняет briefing (используй `/morning-briefing` если нужен snapshot в файл — этот skill только в чат)
- ❌ Не открывает meta-сессию (используй `/start` для полноценной)

## Когда использовать

- В начале дня — посмотреть «что нового, есть ли что-то срочное»
- После закрытия другой сессии — проверить что всё чисто
- Перед `/start` — если есть сомнения нужна ли полная meta-сессия

## Когда НЕ использовать

- Если планируешь делать что-то в brain (тогда `/start` — он подтянет sibling-репо)
- Если нужен sync с origin (тогда `/start` или ручной `git fetch && git pull`)
